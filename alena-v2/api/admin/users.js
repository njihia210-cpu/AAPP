import { api } from '../_lib/handler.js';
import {
  requireHost, hashPassword, passwordProblem, getUser, saveUser, publicUser,
  cleanUsername, destroyAllSessions, methodNotAllowed,
} from '../_lib/auth.js';
import { redis, K, MODULES, normaliseModules, DEFAULT_MODULES } from '../_lib/redis.js';

async function listUsers() {
  const names = (await redis.smembers(K.users)) || [];
  names.sort();
  const users = [];
  for (const name of names) {
    const u = await getUser(name);
    if (u) {
      const subs = await redis.hlen(K.subs(name));
      users.push({ ...publicUser(u), pushDevices: Number(subs || 0) });
    }
  }
  return users;
}

export default api(async function handler(req, res) {
  const host = await requireHost(req, res);
  if (!host) return;

  /* ------------------------------------------------------------- Lesen */
  if (req.method === 'GET') {
    return res.status(200).json({ users: await listUsers(), modules: MODULES });
  }

  /* ---------------------------------------------------------- Anlegen */
  if (req.method === 'POST') {
    const username = cleanUsername(req.body?.username);
    const name = String(req.body?.name || '').trim().slice(0, 80);
    const password = String(req.body?.password || '');
    const role = req.body?.role === 'host' ? 'host' : 'user';

    if (!username || username.length < 3) {
      return res.status(400).json({ error: 'Benutzername: mindestens 3 Zeichen (a–z, 0–9, . _ -).' });
    }
    if (await getUser(username)) {
      return res.status(409).json({ error: 'Diesen Benutzernamen gibt es bereits.' });
    }
    const problem = passwordProblem(password);
    if (problem) return res.status(400).json({ error: problem });

    const user = {
      username,
      name: name || username,
      role,
      active: true,
      modules: req.body?.modules ? normaliseModules(req.body.modules) : { ...DEFAULT_MODULES },
      passwordHash: hashPassword(password),
      mustChangePassword: req.body?.mustChangePassword !== false,
      createdAt: new Date().toISOString(),
      createdBy: host.username,
    };
    await saveUser(user);
    return res.status(201).json({ user: publicUser(user) });
  }

  /* ----------------------------------------------------------- Ändern */
  if (req.method === 'PATCH') {
    const username = cleanUsername(req.body?.username);
    const action = String(req.body?.action || '');
    const user = await getUser(username);
    if (!user) return res.status(404).json({ error: 'Benutzer nicht gefunden.' });

    switch (action) {
      case 'lock':
        if (username === host.username) {
          return res.status(400).json({ error: 'Das eigene Konto kann nicht gesperrt werden.' });
        }
        user.active = false;
        await destroyAllSessions(username);
        break;

      case 'unlock':
        user.active = true;
        break;

      case 'modules':
        user.modules = normaliseModules(req.body?.modules);
        break;

      case 'module': {
        const id = String(req.body?.module || '');
        if (!MODULES.some((m) => m.id === id)) {
          return res.status(400).json({ error: 'Unbekanntes Modul.' });
        }
        user.modules = normaliseModules(user.modules);
        user.modules[id] = Boolean(req.body?.enabled);
        break;
      }

      case 'password': {
        const problem = passwordProblem(String(req.body?.password || ''));
        if (problem) return res.status(400).json({ error: problem });
        user.passwordHash = hashPassword(String(req.body.password));
        user.mustChangePassword = req.body?.mustChangePassword !== false;
        await destroyAllSessions(username);
        break;
      }

      case 'role':
        if (username === host.username) {
          return res.status(400).json({ error: 'Die eigene Rolle kann nicht geändert werden.' });
        }
        user.role = req.body?.role === 'host' ? 'host' : 'user';
        break;

      case 'name':
        user.name = String(req.body?.name || '').trim().slice(0, 80) || user.username;
        break;

      case 'signout':
        await destroyAllSessions(username);
        break;

      default:
        return res.status(400).json({ error: 'Unbekannte Aktion.' });
    }

    user.updatedAt = new Date().toISOString();
    await saveUser(user);
    return res.status(200).json({ user: publicUser(user) });
  }

  /* ----------------------------------------------------------- Löschen */
  if (req.method === 'DELETE') {
    const username = cleanUsername(req.query?.username || req.body?.username);
    if (!username) return res.status(400).json({ error: 'Benutzername fehlt.' });
    if (username === host.username) {
      return res.status(400).json({ error: 'Das eigene Konto kann nicht gelöscht werden.' });
    }
    const hosts = (await listUsers()).filter((u) => u.role === 'host');
    if (hosts.length <= 1 && hosts[0]?.username === username) {
      return res.status(400).json({ error: 'Es muss mindestens ein Host-Konto bestehen bleiben.' });
    }
    await destroyAllSessions(username);
    await redis.del(K.user(username), K.subs(username));
    await redis.srem(K.users, username);
    return res.status(200).json({ ok: true });
  }

  return methodNotAllowed(res, ['GET', 'POST', 'PATCH', 'DELETE']);
});

import { Adapter } from "next-auth/adapters";
import { Pool } from "mysql2/promise";
import { randomUUID } from "crypto";

export function MySQLAdapter(pool: Pool): Adapter {
  return {
    async createUser(user: any) {
      const id = randomUUID();
      const { name, email, emailVerified, image } = user;
      await pool.execute(
        `INSERT INTO User (id, name, email, emailVerified, image) VALUES (?, ?, ?, ?, ?)`,
        [id, name, email, emailVerified || null, image || null]
      );
      const [rows] = await pool.execute(`SELECT * FROM User WHERE id = ?`, [id]);
      return (rows as any[])[0];
    },
    async getUser(id: string) {
      const [rows] = await pool.execute(`SELECT * FROM User WHERE id = ?`, [id]);
      const user = (rows as any[])[0];
      return user || null;
    },
    async getUserByEmail(email: string) {
      const [rows] = await pool.execute(`SELECT * FROM User WHERE email = ?`, [email]);
      const user = (rows as any[])[0];
      return user || null;
    },
    async getUserByAccount({ providerAccountId, provider }: any) {
      const [rows] = await pool.execute(
        `SELECT User.* FROM User JOIN Account ON User.id = Account.userId WHERE Account.providerAccountId = ? AND Account.provider = ?`,
        [providerAccountId, provider]
      );
      const user = (rows as any[])[0];
      return user || null;
    },
    async updateUser(user: any) {
      if (!user.id) throw new Error("Missing user id");
      
      const updates = [];
      const values = [];
      for (const [key, value] of Object.entries(user)) {
        if (key !== "id" && value !== undefined) {
          updates.push(`${key} = ?`);
          values.push(value);
        }
      }
      
      if (updates.length > 0) {
        values.push(user.id);
        await pool.execute(
          `UPDATE User SET ${updates.join(", ")} WHERE id = ?`,
          values
        );
      }
      
      const [rows] = await pool.execute(`SELECT * FROM User WHERE id = ?`, [user.id]);
      return (rows as any[])[0];
    },
    async deleteUser(userId: string) {
      await pool.execute(`DELETE FROM User WHERE id = ?`, [userId]);
    },
    async linkAccount(account: any) {
      const id = randomUUID();
      const {
        userId, type, provider, providerAccountId, refresh_token,
        access_token, expires_at, token_type, scope, id_token, session_state
      } = account;
      
      await pool.execute(
        `INSERT INTO Account (id, userId, type, provider, providerAccountId, refresh_token, access_token, expires_at, token_type, scope, id_token, session_state) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id, userId, type, provider, providerAccountId, refresh_token || null,
          access_token || null, expires_at || null, token_type || null,
          scope || null, id_token || null, session_state || null
        ]
      );
      return account;
    },
    async unlinkAccount({ providerAccountId, provider }: any) {
      await pool.execute(
        `DELETE FROM Account WHERE providerAccountId = ? AND provider = ?`,
        [providerAccountId, provider]
      );
    },
    async createSession({ sessionToken, userId, expires }: any) {
      const id = randomUUID();
      await pool.execute(
        `INSERT INTO Session (id, sessionToken, userId, expires) VALUES (?, ?, ?, ?)`,
        [id, sessionToken, userId, expires]
      );
      return { id, sessionToken, userId, expires };
    },
    async getSessionAndUser(sessionToken: string) {
      const [sessionRows] = await pool.execute(`SELECT * FROM Session WHERE sessionToken = ?`, [sessionToken]);
      const session = (sessionRows as any[])[0];
      if (!session) return null;
      
      const [userRows] = await pool.execute(`SELECT * FROM User WHERE id = ?`, [session.userId]);
      const user = (userRows as any[])[0];
      if (!user) return null;
      
      return { session, user };
    },
    async updateSession(session: any) {
      const { sessionToken } = session;
      const updates = [];
      const values = [];
      for (const [key, value] of Object.entries(session)) {
        if (key !== "sessionToken" && value !== undefined) {
          updates.push(`${key} = ?`);
          values.push(value);
        }
      }
      
      if (updates.length > 0) {
        values.push(sessionToken);
        await pool.execute(
          `UPDATE Session SET ${updates.join(", ")} WHERE sessionToken = ?`,
          values
        );
      }
      
      const [rows] = await pool.execute(`SELECT * FROM Session WHERE sessionToken = ?`, [sessionToken]);
      return (rows as any[])[0] || null;
    },
    async deleteSession(sessionToken: string) {
      await pool.execute(`DELETE FROM Session WHERE sessionToken = ?`, [sessionToken]);
    },
    async createVerificationToken({ identifier, expires, token }: any) {
      await pool.execute(
        `INSERT INTO VerificationToken (identifier, expires, token) VALUES (?, ?, ?)`,
        [identifier, expires, token]
      );
      return { identifier, expires, token };
    },
    async useVerificationToken({ identifier, token }: any) {
      const [rows] = await pool.execute(
        `SELECT * FROM VerificationToken WHERE identifier = ? AND token = ?`,
        [identifier, token]
      );
      const verificationToken = (rows as any[])[0];
      if (!verificationToken) return null;
      
      await pool.execute(
        `DELETE FROM VerificationToken WHERE identifier = ? AND token = ?`,
        [identifier, token]
      );
      
      return verificationToken;
    }
  };
}

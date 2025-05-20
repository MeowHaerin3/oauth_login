const { db } = require('../db');
const { users } = require('../db/schema');
const { eq } = require('drizzle-orm');

async function findOrCreateUser(profile) {
  if (!profile.id) {
    throw new Error('Profile ID is required');
  }

  // Try to find existing user
  let [user] = await db
    .select()
    .from(users)
    .where(eq(users.googleId, profile.id))
    .limit(1);

  // If user doesn't exist, create new one
  if (!user) {
    const [newUser] = await db
      .insert(users)
      .values({
        googleId: profile.id,
        email: profile.emails?.[0]?.value,
        displayName: profile.displayName,
        image: profile.photos?.[0]?.value
      })
      .returning();
    user = newUser;
  }

  return user;
}

module.exports = { findOrCreateUser };

import passport from "passport";
import { Strategy as DiscordStrategy } from "passport-discord";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Strategy as LocalStrategy } from "passport-local";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();

// **Discord OAuth**
passport.use(
  new DiscordStrategy(
    {
      clientID: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      callbackURL: process.env.DISCORD_CALLBACK_URL!,
      scope: ["identify", "email", "avatar"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await prisma.user.findUnique({ 
          where: { 
            oauthProvider_oauthProviderId: { 
              oauthProvider: "discord", 
              oauthProviderId: profile.id 
            } 
          } 
        });
        
        if (!user) {
          user = await prisma.user.create({
            data: {
              oauthProvider: "discord",
              oauthProviderId: profile.id,
              email: profile.email!,
              firstName: profile.username,
              avatarUrl: profile.avatar,
            },
          });
        }
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

// **GitHub OAuth**
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: process.env.GITHUB_CALLBACK_URL!,
      scope: ["user:email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        let user = await prisma.user.findUnique({ 
          where: { 
            oauthProvider_oauthProviderId: { 
              oauthProvider: "github",
              oauthProviderId: profile.id 
            } 
          } 
        });
        
        if (!user) {
          user = await prisma.user.create({
            data: {
              oauthProvider: "github",
              oauthProviderId: profile.id,
              email: email!,
              firstName: profile.username,
              avatarUrl: profile.photos?.[0]?.value,
            },
          });
        }
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

// **Email + Password Login**
passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user || !user.password) {
        return done(null, false, { message: "Incorrect email or password" });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return done(null, false, { message: "Incorrect email or password" });
      }

      done(null, user);
    }
  )
);

passport.serializeUser((user: any, done) => done(null, user.id));
passport.deserializeUser(async (id: number, done) => {
  const user = await prisma.user.findUnique({ where: { id } });
  done(null, user);
});

export default passport;

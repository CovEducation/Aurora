import { default as firebase } from "firebase-admin";
import { NextFunction, Request, Response } from "express";

import ParentModel from "../../models/Parents";
import MentorModel from "../../models/Mentors";

const verify = (token: string) => {
  return firebase.auth().verifyIdToken(token);
};

const getUserId = (user: firebase.auth.DecodedIdToken) => {
  return MentorModel.findOne({ firebaseUID: user.sub }).then((doc) => {
    if (doc === null) {
      return ParentModel.findOne({ firebaseUID: user.sub }).then(
        (doc) => doc?._id
      );
    } else {
      return doc._id;
    }
  });
};

const login = (req: Request, res: Response) => {
  if (req.session.userId !== undefined) {
    res.send(400).send({ err: "Already logged in." });
  } else {
    verify(req.headers.token || req.body.token)
      .then((user) => {
        if (user === undefined) return;
        return getUserId(user);
      })
      .then((userId) => {
        if (userId === null || userId === undefined) {
          throw new Error("Unable to retrieve user.");
        }
        req.session.userId = userId;
        res.send({ userId });
      })
      .catch((err) => {
        res.status(401).send({ err });
      });
  }
};

const logout = (req: Request, res: Response) => {
  if (req.session.userId === undefined) {
    res.status(400).send({ err: "Already logged out" });
  } else {
    req.session.userId = undefined;
    res.send({});
  }
};

const ensureLoggedIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.session.userId !== undefined) {
    next();
  } else {
    verify(req.headers.token)
      .then((user) => {
        if (user === undefined) {
          res.status(401).send({ err: "Not logged in." });
          return;
        }
        return getUserId(user);
      })
      .then((id) => {
        if (id === undefined) {
          throw new Error("Unable to retrieve user.");
        }
        req.session.userId = id;
        next();
      })
      .catch(() => {
        res.status(401).send({ err: "Not logged in." });
      });
  }
};

export default {
  ensureLoggedIn,
  login,
  logout,
};

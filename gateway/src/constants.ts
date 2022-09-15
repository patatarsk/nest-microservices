const { PORT } = process.env;

export const jwtConstants = {
  secret: 'secretKey',
};

export const bcryptConstants = {
  saltRounds: 10,
};

export const recoveryConstants = {
  secret: 'keySecret',
  linkToEndpoint: `http://localhost:${PORT}/auth/recover-password/`,
};

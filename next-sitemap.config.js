/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: `https://authzed.com${process.env.BASE_DIR ?? ''}`,
  generateRobotsTxt: true,
  // ...other options
};

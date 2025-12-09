/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: `https://authzed.com${process.env.NEXT_PUBLIC_BASE_DIR ?? ""}`,
  generateRobotsTxt: true,
  // ...other options
};

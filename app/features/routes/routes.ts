export class Routes {
  static site = "/site";
  static api = "/api";
  static admin = `${this.site}/jcv-admin`;
  static blog = `${this.site}/blog`;
  static apiJwt = `${this.api}/jwt`;
  static apiArticles = `${this.api}/articles`;
  static apiProjects = `${this.api}/projects`;
  static adminArticle = `${this.admin}/articles`;
}

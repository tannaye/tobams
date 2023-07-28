import Base from "./base.js";

export class PostFilter extends Base {
    listPostQuery({ query }) {
        const searchFields = ["title", "body"];

        const queryFields = ["id-_id", "title"];

        return this.getQuery(query, queryFields, searchFields);
    }
}

export default new PostFilter();

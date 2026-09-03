class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    search() {
        const keyword = this.queryStr.keyword
            ? {
                  name: {
                      $regex: this.queryStr.keyword,
                      $options: "i",
                  },
              }
            : {};

        this.query = this.query.find(keyword);

        return this;
    }

  filter() {
    const queryCopy = JSON.parse(JSON.stringify(this.queryStr));

    const removeFields = ["keyword", "page", "limit"];

    removeFields.forEach((key) => delete queryCopy[key]);

    Object.keys(queryCopy).forEach((key) => {
        if (
            typeof queryCopy[key] === "object" &&
            queryCopy[key] !== null
        ) {
            Object.keys(queryCopy[key]).forEach((operator) => {
                if (["gte", "gt", "lte", "lt"].includes(operator)) {
                    queryCopy[key][`$${operator}`] = Number(
                        queryCopy[key][operator]
                    );

                    delete queryCopy[key][operator];
                }
            });
        }
    });

    this.query = this.query.find(queryCopy);

    return this;
}
    pagination(resultPerPage) {
        const currentPage = Number(this.queryStr.page) || 1;

        const skip = resultPerPage * (currentPage - 1);

        this.query = this.query
            .limit(resultPerPage)
            .skip(skip);

        return this;
    }
}

module.exports = ApiFeatures;
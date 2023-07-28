import pkg from "mongoose";
import { convertToObjectId, nilObjectId } from "../helpers/index.js";
const { Types } = pkg;

export class Base {
    constructor() {}

    getDateRange({ start_date, end_date }) {
        if (!start_date || start_date === "") {
            start_date = new Date("2021-01-01");
        } else {
            start_date = new Date(start_date);
        }

        if (!end_date || end_date === "") {
            end_date = new Date();
        } else {
            end_date = new Date(end_date);
        }

        start_date.setHours(Number("00"), Number("00"), Number("00"));
        end_date.setHours(23, 59, 59);

        return { start_date, end_date };
    }

    getDateRangeByDateBy(dateBy) {
        let start_date = new Date();
        let end_date = new Date();

        switch (dateBy) {
            case "today":
                start_date.setHours(Number("00"), Number("00"), Number("00"));
                end_date.setHours(23, 59, 59);
                break;
            case "yesterday":
                start_date.setDate(start_date.getDate() - 1);
                end_date.setDate(end_date.getDate() - 1);
                start_date.setHours(Number("00"), Number("00"), Number("00"));
                end_date.setHours(23, 59, 59);
                break;
            case "this_week":
                start_date.setDate(start_date.getDate() - start_date.getDay());
                start_date.setHours(Number("00"), Number("00"), Number("00"));
                end_date.setHours(23, 59, 59);
                break;
            case "last_week":
                start_date.setDate(start_date.getDate() - start_date.getDay() - 7);
                end_date.setDate(end_date.getDate() - end_date.getDay() - 1);
                start_date.setHours(Number("00"), Number("00"), Number("00"));
                end_date.setHours(23, 59, 59);
                break;
            case "this_month":
                start_date.setDate(1);
                start_date.setHours(Number("00"), Number("00"), Number("00"));
                end_date.setHours(23, 59, 59);
                break;
            case "last_month":
                start_date.setDate(1);
                start_date.setMonth(start_date.getMonth() - 1);
                end_date.setDate(0);
                start_date.setHours(Number("00"), Number("00"), Number("00"));
                end_date.setHours(23, 59, 59);
                break;
            case "this_year":
                start_date.setMonth(0);
                start_date.setDate(1);
                start_date.setHours(Number("00"), Number("00"), Number("00"));
                end_date.setHours(23, 59, 59);
                break;
            case "last_year":
                start_date.setFullYear(start_date.getFullYear() - 1);
                start_date.setMonth(0);
                start_date.setDate(1);
                end_date.setFullYear(end_date.getFullYear() - 1);
                end_date.setMonth(11);
                end_date.setDate(31);
                start_date.setHours(Number("00"), Number("00"), Number("00"));
                end_date.setHours(23, 59, 59);
                break;
            default:
                start_date.setHours(Number("00"), Number("00"), Number("00"));
                end_date.setHours(23, 59, 59);
                break;
        }

        return { start_date, end_date };
    }

    getSearchQuery(query, searches) {
        const searchQuery = [];

        if (query["search"]) {
            const regex = {
                $regex: query["search"],
                $options: "i",
            };

            for (let i = 0; i < searches.length; i++) {
                const search = {};
                search[searches[i]] = regex;
                searchQuery.push(search);
            }
        }

        return searchQuery;
    }

    getQuery(query, fields, searchFields) {
        const queryObject = {
            deleted: false,
        };

        // get date range
        let { start_date, end_date } = this.getDateRange(query);
        if (query["date_by"]) {
            ({ start_date, end_date } = this.getDateRangeByDateBy(query["date_by"]));
        }

        // get search query
        const searchQuery = this.getSearchQuery(query, searchFields);

        if (searchQuery.length > 0) {
            queryObject["$or"] = searchQuery;
        }

        queryObject["createdAt"] = {
            $gte: start_date,
            $lte: end_date,
        };

        // compute query
        for (let i = 0; i < fields.length; i++) {
            const field = fields[i];
            // split field
            const fieldSplit = field.split("-");
            if (fieldSplit.length > 1) {
                if (query[fieldSplit[1]] && query[fieldSplit[1]] !== "") {
                    switch (fieldSplit[0]) {
                        case "id":
                            queryObject[fieldSplit[1]] = new Types.ObjectId(query[fieldSplit[1]]);
                            break;
                        case "bool":
                            queryObject[fieldSplit[1]] = query[fieldSplit[1]] === "true";
                            break;
                        case "number": {
                            const numValues = query[fieldSplit[1]].split("/");
                            if (numValues.length > 1) {
                                queryObject[fieldSplit[1]] = {
                                    $gte: Number(numValues[0]),
                                    $lte: Number(numValues[1]),
                                };
                            }
                            break;
                        }
                        case "date": {
                            const dateValues = query[fieldSplit[1]].split(",");
                            if (dateValues.length > 1) {
                                const startDate = new Date(dateValues[0]);
                                const endDate = new Date(dateValues[1]);
                                start_date.setHours(0, 0, 0);
                                end_date.setHours(23, 59, 59);
                                queryObject[fieldSplit[1]] = {
                                    $gte: startDate,
                                    $lte: endDate,
                                };
                            }
                            break;
                        }
                        default:
                            queryObject[fieldSplit[1]] = query[fieldSplit[1]];
                    }
                }

                if (fieldSplit[0] === "obj") {
                    const queries = Object.entries(query);
                    queries.map(q => {
                        if (q[0].toString().slice(0, fieldSplit[1].length) === fieldSplit[1]) {
                            queryObject[q[0]] = q[1];
                        }
                    });
                }
            } else {
                if (query[field] && query[field] !== "") {
                    queryObject[field] = query[field];
                }
            }
        }

        return queryObject;
    }

    getSortQuery(query, fields) {
        const sortQuery = {};

        for (let i = 0; i < fields.length; i++) {
            const field = fields[i];
            if (query[field]) {
                sortQuery[field] = Number(query[field]);
            } else {
                sortQuery[field] = 1;
            }
        }

        return sortQuery;
    }

    lookup(localKey, foreignKey, as, coll, queries = null, project = null, pipeline_ = null) {
        let matchQuery = {
            deleted: false,
            $expr: {
                $eq: ["$" + foreignKey, "$$id"],
            },
        };

        if (queries) {
            matchQuery = {
                ...matchQuery,
                ...queries,
            };
        }

        let pipeline = [];

        if (pipeline_) {
            if (pipeline_.length > 0) {
                pipeline = pipeline_;
            }
        }

        pipeline.push({
            $match: matchQuery,
        });

        if (project) {
            if (project.length > 0) {
                pipeline.push({
                    $project: this.projectQuery(project),
                });
            }
        }

        return {
            $lookup: {
                from: coll,
                let: {
                    id: "$" + localKey,
                },
                pipeline,
                as,
            },
        };
    }

    projectQuery(project) {
        const projectQuery = {};

        for (let i = 0; i < project.length; i++) {
            const field = project[i];
            if (field[0] === "-") {
                projectQuery[field.substring(1)] = 0;
            } else {
                projectQuery[field] = 1;
            }
        }

        return projectQuery;
    }

    unwind(path, preserveNullAndEmptyArrays = true) {
        return {
            $unwind: {
                path: `$${path}`,
                preserveNullAndEmptyArrays,
            },
        };
    }

    project(project) {
        const projectQ = this.projectQuery(project);
        return {
            $project: projectQ,
        };
    }

    processData(data, fields, replacement = null) {
        let result = {};

        for (let i = 0; i < fields.length; i++) {
            const field = fields[i];
            // split field
            const fieldSplit = field.split("-");
            if (fieldSplit.length > 1) {
                switch (fieldSplit[0]) {
                    case "id":
                        if (data[fieldSplit[1]] !== undefined) {
                            result[fieldSplit[1]] = convertToObjectId(data[fieldSplit[1]]);
                        } else {
                            if (replacement) {
                                result[fieldSplit[1]] = replacement[fieldSplit[1]];
                            } else {
                                result[fieldSplit[1]] = nilObjectId();
                            }
                        }
                        break;
                    default:
                        if (data[fieldSplit[1]] !== undefined) {
                            result[fieldSplit[1]] = data[fieldSplit[1]];
                        } else {
                            if (replacement) {
                                result[fieldSplit[1]] = replacement[fieldSplit[1]];
                            } else {
                                result[fieldSplit[1]] = null;
                            }
                        }
                }
            } else {
                if (data[field] !== undefined) {
                    result[field] = data[field];
                } else {
                    if (replacement) {
                        result[field] = replacement[field];
                    } else {
                        result[field] = null;
                    }
                }
            }
        }

        return result;
    }
}

export default Base;

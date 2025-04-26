"use server";

import { Question, User, Answer, Tag } from "@/database";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { GlobalSearchSchema } from "../validations";

export const globalSearch = async (params: GlobalSearchParams) => {
  try {
    const validationResult = await action({
      params,
      schema: GlobalSearchSchema,
    });

    if (validationResult instanceof Error) {
      return handleError(validationResult) as ErrorResponse;
    }

    const { query, type } = params;
    const regexQuery = { $regex: query, $options: "i" };

    let results = [];

    const modelsAndTypes = [
      { model: Question, seachField: "title", type: "question" },
      { model: User, seachField: "name", type: "user" },
      { model: Answer, seachField: "content", type: "answer" },
      { model: Tag, seachField: "name", type: "tag" },
    ];

    const typeLower = type?.toLowerCase();

    const searchableTypes = ["question", "answer", "user", "tag"];

    if (!typeLower || !searchableTypes.includes(typeLower)) {
      // if no type is provided, search all models
      for (const { model, seachField, type } of modelsAndTypes) {
        const queryResults = await model
          .find({ [seachField]: regexQuery })
          .limit(2);

        results.push(
          ...queryResults.map((item) => ({
            title:
              type === "answers"
                ? `Answers containing ${query}`
                : item[seachField],
            type ,
            id: type === "answer" ? item.question : item._id,
          }))
        );
      }
    } else {
      const modelInfo = modelsAndTypes.find((item) => item.type === typeLower);

      if (!modelInfo) {
        throw new Error("Invalid search type");
      }

      const queryResults = await modelInfo.model
        .find({ [modelInfo.seachField]: regexQuery })
        .limit(8);

      results = queryResults.map((item) => ({
        title:
          modelInfo.type === "answers"
            ? `Answers containing ${query}`
            : item[modelInfo.seachField],
        type,
        id: modelInfo.type === "answer" ? item.question : item._id,
      }));
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(results)),
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

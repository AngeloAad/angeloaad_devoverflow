
import ROUTES from "./routes";

export const DEFAULT_EMPTY = {
  title: "No Data Found",
  message:
    "Looks like the database is taking a nap. Wake it up with some new entries.",
  button: {
    text: "Add Data",
    href: ROUTES.HOME,
  },
};

export const DEFAULT_ERROR = {
  title: "Opps! Something Went Wrong",
  message: "Even our code can have a bad day. Give it another shot.",
  button: {
    text: "Retry Request",
    href: ROUTES.HOME,
  },
};

export const EMPTY_QUESTION = {
  title: "Ahh, No Questions Yet!",
  message:
    "Looks like this User hasn't asked any questions yet.",
};

export const EMPTY_QUESTIONS = {
  title: "Ahh, No Questions Yet!",
  message:
    "The question board is empty. Maybe it’s waiting for your brilliant question to get things rolling",
  button: {
    text: "Ask a Question",
    href: ROUTES.ASK_A_QUESTION,
  },
};

export const EMPTY_TAG = {
  title: "No Tags Found",
  message:
    "Looks like this User hasn't asked any questions yet.",
};

export const EMPTY_TAGS = {
  title: "No Tags Found",
  message: "The tag cloud is empty. Add some keywords to make it rain.",
  button: {
    text: "Create Tag",
    href: ROUTES.ASK_A_QUESTION,
  },
};

export const EMPTY_COLLECTIONS = {
  title: "Collections Are Empty",
  message:
    "Looks like you haven’t created any collections yet. Start curating something extraordinary today",
  button: {
    text: "Save to Collection",
    href: ROUTES.HOME,
  },
};

export const EMPTY_ANSWER = {
  title: "No Answers Found",
  message: "Looks like this User hasn't answered any questions yet.",
};

export const EMPTY_ANSWERS = {
  title: "No Answers Found",
  message: "Be the first to answer this question.",
};


export const EMPTY_USERS = {
  title: "No Users Found",
  message:
    "It's ALONE in the world. You're the only one here. Join us and let the world know who you are.",
};

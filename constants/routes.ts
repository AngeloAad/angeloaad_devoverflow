const ROUTES = {
    HOME: "/",
    SIGN_IN: "/sign-in",
    SIGN_UP: "/sign-up",
    ASK_A_QUESTION: "/ask-a-question",
    COLLECTIONS: "/collections",
    COMMUNITIES: "/communities",
    TAGS: "/tags",
    JOBS: "/find-jobs",
    SIGN_IN_WITH_OAUTH: `signin-with-oauth`,
    PROFILE: (id: string) => `/profile/${id}`,
    QUESTION: (id: string) => `/questions/${id}`,
    TAG: (id: string) => `/tags/${id}`,
    COLLECTION: (id: string) => `/collections/${id}`,
  };
  
  export default ROUTES;
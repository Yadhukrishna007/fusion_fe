import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    conversations: [],
    activeConversation: "",
    messages: [],
    files: [],
  },
  reducers: {
    storeOpenConversation: (state, action) => {
      state.conversations = action.payload;
    },
    storeActiveConversation: (state, action) => {
      state.activeConversation = action.payload;
      state.files = [];
    },

    createGroup: (state, action) => {
      state.conversations = [action.payload, ...state.conversations];
    },
    updateGroup: (state, action) => {
      state.activeConversation = action.payload;
      state.files = [];

      const index = state?.conversations?.findIndex(
        (item) => item._id === action.payload._id
      );

      // Ensure the item exists before attempting to update
      if (index !== -1) {
        // Create a new array with the updated object to maintain immutability
        state.conversations = state?.conversations?.map((item, i) =>
          i === index ? action.payload : item
        );
      }
    },

    updateGroupPic: (state, action) => {
      if (state?.activeConversation?._id === action.payload._id) {
        state.activeConversation = action.payload;
      }
      const index = state?.conversations?.findIndex(
        (item) => item._id === action.payload._id
      );

      // Ensure the item exists before attempting to update
      if (index !== -1) {
        // Create a new array with the updated object to maintain immutability
        state.conversations = state.conversations.map((item, i) =>
          i === index ? action.payload : item
        );
      }
    },
    updateGroupInfo: (state, action) => {
      if (state?.activeConversation?._id === action.payload._id) {
        state.activeConversation = action.payload;
      }
      const index = state.conversations.findIndex(
        (item) => item._id === action.payload._id
      );

      // Ensure the item exists before attempting to update
      if (index !== -1) {
        // Create a new array with the updated object to maintain immutability
        state.conversations = state.conversations.map((item, i) =>
          i === index ? action.payload : item
        );
      }
    },

    updateUserInfo: (state, action) => {
      for (let i = 0; i < state?.activeConversation?.users?.length; i++) {
        if (state.activeConversation.users[i]._id === action.payload._id) {
          state.activeConversation.users[i] = {
            ...state.activeConversation.users[i],
            ...action.payload,
          };
        }
      }

      for (let convo of state.conversations) {
        for (let i = 0; i < convo?.users?.length; i++) {
          if (convo.users[i]._id === action.payload._id) {
            convo.users[i] = { ...convo.users[i], ...action.payload };
          }
        }
      }
    },

    updateUserPic: (state, action) => {
      for (let i = 0; i < state?.activeConversation?.users?.length; i++) {
        if (state.activeConversation.users[i]._id === action.payload._id) {
          state.activeConversation.users[i] = {
            ...state.activeConversation.users[i],
            ...action.payload,
          };
        }
      }

      for (let convo of state.conversations) {
        for (let i = 0; i < convo.users.length; i++) {
          if (convo.users[i]._id === action.payload._id) {
            convo.users[i] = { ...convo.users[i], ...action.payload };
          }
        }
      }
    },

    storeMessages: (state, action) => {
      state.messages = action.payload;
    },
    storeSendMessage: (state, action) => {
      state.messages = [...state.messages, action.payload];
      let conversation = {
        ...action.payload.conversation,
        latestMessage: action.payload,
      };

      let filteredconversation = [...state.conversations].filter(
        (item) => item._id !== conversation._id
      );

      filteredconversation.unshift(conversation);

      state.conversations = filteredconversation;
    },

    updateMessagesAndConversations: (state, action) => {
      if (action.payload.conversation._id === state?.activeConversation?._id) {
        state.messages = [...state.messages, action.payload];
      }
      let conversation = {
        ...action.payload.conversation,
        latestMessage: action.payload,
      };

      let filteredconversation = [...state.conversations].filter(
        (item) => item._id !== conversation._id
      );

      filteredconversation.unshift(conversation);

      state.conversations = filteredconversation;
    },
    storeFiles: (state, action) => {
      state.files = [...state.files, action.payload];
    },
    emptyFiles: (state, action) => {
      state.files = [];
    },
    deleteFiles: (state, action) => {
      state.files = action.payload;
    },
  },
});
export const {
  storeOpenConversation,
  storeActiveConversation,
  createGroup,
  updateGroup,
  updateGroupPic,
  updateGroupInfo,
  updateUserInfo,
  updateUserPic,
  storeMessages,
  storeSendMessage,
  updateMessagesAndConversations,
  storeFiles,
  emptyFiles,
  deleteFiles,
} = chatSlice.actions;
export default chatSlice.reducer;

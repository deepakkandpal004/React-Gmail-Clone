import { createSlice } from "@reduxjs/toolkit";

const appSlice = createSlice({
    name:"appSlice",
    initialState:{
        first:false,
        emails:[],
        selectedEmail:null,
        searchText:"",
        user:null,
        composePrefill:null,
        folder:"inbox"
    },
    reducers:{
        setFirst:(state, action) => {
            state.first = action.payload;
        },
        setEmails:(state, action) => {
            state.emails = action.payload;
        },
        setSelectedEmail:(state, action) => {
            state.selectedEmail = action.payload;
        },
        setSearchText:(state, action) => {
            state.searchText = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setComposePrefill:(state, action) => {
            state.composePrefill = action.payload;
        },
        setFolder:(state, action) => {
            state.folder = action.payload;
        }

    }
});

export const {setFirst, setEmails, setSelectedEmail, setSearchText, setUser, setComposePrefill, setFolder} = appSlice.actions;
export default appSlice.reducer;
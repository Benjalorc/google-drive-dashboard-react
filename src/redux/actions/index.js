import { SET_USER, GET_USER } from "../constants/action-types";

export function setUser(payload){
	return {type: SET_USER, payload}
}

export function getUser(payload){
	return {type: GET_USER, payload}
}
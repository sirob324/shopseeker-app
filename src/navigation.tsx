import { createRef } from "react";
import {
    NavigationContainerRef,
    StackActions,
    DrawerActions,
    CommonActions,
} from "@react-navigation/native";

export const navigationRef = createRef<NavigationContainerRef>();

export const routeNameRef = createRef();

export function navigate(name: string, params: object | undefined = {}) {
    navigationRef.current?.navigate(name, params);
}

export function reset(state: any) {
    navigationRef.current?.dispatch(CommonActions.reset(state));
}

export function goBack() {
    navigationRef.current?.dispatch(CommonActions.goBack());
}

export function setParams(params: object) {
    navigationRef.current?.dispatch(CommonActions.setParams(params));
}

export function replace(name: string, params: object | undefined) {
    navigationRef.current?.dispatch(StackActions.replace(name, params));
}

export function push(name: string, params: object | undefined) {
    navigationRef.current?.dispatch(StackActions.push(name, params));
}

export function pop(count: number) {
    navigationRef.current?.dispatch(StackActions.pop(count));
}

export function popToTop() {
    navigationRef.current?.dispatch(StackActions.popToTop());
}

export function openDrawer() {
    navigationRef.current?.dispatch(DrawerActions.openDrawer());
}

export function closeDrawer() {
    navigationRef.current?.dispatch(DrawerActions.closeDrawer());
}

export function toggleDrawer() {
    navigationRef.current?.dispatch(DrawerActions.toggleDrawer());
}

export function jumpTo(name: string, params: object | undefined) {
    navigationRef.current?.dispatch(DrawerActions.jumpTo(name, params));
}

export default navigationRef;

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'

// Create Virtual Routes

const IndexLazyImport = createFileRoute('/')()
const RoomRoomIdLazyImport = createFileRoute('/room/$roomId')()

// Create/Update Routes

const IndexLazyRoute = IndexLazyImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/index.lazy').then((d) => d.Route))

const RoomRoomIdLazyRoute = RoomRoomIdLazyImport.update({
  id: '/room/$roomId',
  path: '/room/$roomId',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/room.$roomId.lazy').then((d) => d.Route))

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/room/$roomId': {
      id: '/room/$roomId'
      path: '/room/$roomId'
      fullPath: '/room/$roomId'
      preLoaderRoute: typeof RoomRoomIdLazyImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexLazyRoute
  '/room/$roomId': typeof RoomRoomIdLazyRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexLazyRoute
  '/room/$roomId': typeof RoomRoomIdLazyRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexLazyRoute
  '/room/$roomId': typeof RoomRoomIdLazyRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/room/$roomId'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/room/$roomId'
  id: '__root__' | '/' | '/room/$roomId'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexLazyRoute: typeof IndexLazyRoute
  RoomRoomIdLazyRoute: typeof RoomRoomIdLazyRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexLazyRoute: IndexLazyRoute,
  RoomRoomIdLazyRoute: RoomRoomIdLazyRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/room/$roomId"
      ]
    },
    "/": {
      "filePath": "index.lazy.tsx"
    },
    "/room/$roomId": {
      "filePath": "room.$roomId.lazy.tsx"
    }
  }
}
ROUTE_MANIFEST_END */

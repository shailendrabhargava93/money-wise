# MoneyWise

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.2.4.

## Firebase with angular
  - setup node js firebase
    https://firebase.google.com/docs/admin/setup#node.js
  - ADMIN SDK reference
    https://firebase.google.com/docs/reference/admin
  - Google api library (enable Cloud Firestore API )
    https://cloud.google.com/service-usage/docs/enable-disable

  - Read and Write Data in firebase
    https://firebase.google.com/docs/firestore/manage-data/add-data
    https://firebase.google.com/docs/firestore/query-data/get-data

  - Rule Setup
    `
    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        match /transactions/{txn} {
          allow read: if true;
          allow write: if true;
        }
      }
    }
    `

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

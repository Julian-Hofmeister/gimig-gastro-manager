import { Injectable } from '@angular/core';

import { AngularFireModule } from '@angular/fire';
import {
  AngularFireStorage,
  AngularFireStorageModule,
  AngularFireStorageReference,
  AngularFireUploadTask,
} from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class ImgUploadService {
  constructor(private afStorage: AngularFireStorage) {}

  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;

  // UPLOAD IMAGE
  upload = (event: any, folder: string) => {
    // create a random id
    const randomId = Math.random().toString(36).substring(2);
    // create a reference to the storage bucket location
    this.ref = this.afStorage.ref('/' + folder + '/' + randomId);
    // the put method creates an AngularFireUploadTask
    // and kicks off the upload
    this.task = this.ref.put(event.target.files[0]);
  };
}

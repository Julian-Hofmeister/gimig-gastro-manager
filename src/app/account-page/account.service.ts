import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {
  AngularFireStorage,
  AngularFireStorageReference,
} from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  //#region [ PROPERTIES ] /////////////////////////////////////////////////////////////////////////

  ref: AngularFireStorageReference;

  userEmail = JSON.parse(localStorage.getItem('user')).email;

  //#endregion

  //#region [ CONSTRUCTORS ] //////////////////////////////////////////////////////////////////////

  constructor(
    public afs: AngularFirestore,
    private afStorage: AngularFireStorage
  ) {}

  //#endregion

  //#region [ PUBLIC ] ////////////////////////////////////////////////////////////////////////////

  async addBackgroundImage(event: any) {
    // GET IMG REFERNCE
    const randomId = Math.random().toString(36).substring(2);
    var imagePath: string = '/backgroundImages/' + randomId;

    this.ref = this.afStorage.ref(imagePath);
    // UPLOAD IMAGE TO FIREBASE STORAGE
    let task = await this.ref.put(event.target.files[0]);

    console.log(task.state);

    //   // ADD NEW CATEGORY TO FIRESTORE IF IMG UPLOAD SUCCESSFUL
    if (task.state == 'success') {
      this.afs.collection('restaurants').doc(this.userEmail).update({
        imagePath: imagePath,
      });
    } else {
      // CATCH ERRORS
      console.log('UPLOAD FAILED');
    }
  }
  // ----------------------------------------------------------------------------------------------

  //#endregion

  //#region [ PRIVATE ] ///////////////////////////////////////////////////////////////////////////

  // ----------------------------------------------------------------------------------------------

  //#endregion
}

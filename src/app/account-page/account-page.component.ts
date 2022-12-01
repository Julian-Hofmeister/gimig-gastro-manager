import { Component, OnInit } from '@angular/core';
import { ImageService } from '../shared/image.service';
import { AccountService } from './account.service';

@Component({
  selector: 'app-account-page',
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.css'],
})
export class AccountPageComponent implements OnInit {
  //#region [ BINDINGS ] //////////////////////////////////////////////////////////////////////////

  //#endregion

  //#region [ PROPERTIES ] /////////////////////////////////////////////////////////////////////////

  bgImageText = 'Bild auswählen';
  bgUrl: any;

  selectedFile = null;
  imagePath: any;
  id: string;
  bgImage: any;

  // EDIT MODE
  isEditMode = false;
  editImage: any;
  downloadUrl: string;

  //#endregion

  //#region [ MEMBERS ] ///////////////////////////////////////////////////////////////////////////

  //#endregion

  //#region [ CONSTRUCTORS ] //////////////////////////////////////////////////////////////////////

  constructor(
    private accountService: AccountService,
    private imageService: ImageService
  ) {}

  //#endregion

  //#region [ LIFECYCLE ] /////////////////////////////////////////////////////////////////////////

  ngOnInit() {}

  //#endregion

  //#region [ EMITTER ] ///////////////////////////////////////////////////////////////////////////

  //#endregion

  //#region [ RECEIVER ] ///////////////////////////////////////////////////////////////////////////

  //#endregion

  //#region [ PUBLIC ] ////////////////////////////////////////////////////////////////////////////

  onFileSelected(event: any) {
    // this.selectedFile = event.target.files[0];
    // var files = event.target.files;

    // // CHECK FILE SIZE
    // const fileSize = Math.round(this.selectedFile.size / 1000);

    // if (fileSize > 2000) {
    //   window.confirm(
    //     'Die Datei ist zu groß. (' +
    //       fileSize +
    //       'kb)\nDie maximale Dateigröße liegt bei 900kb.'
    //   );
    //   return;
    // }

    // // CHECK EMPTY
    // if (files.length === 0) return;

    // // CHECK FILE TYPE
    // var mimeType = files[0].type;

    // if (mimeType.match(/image\/*/) == null) {
    //   window.confirm(
    //     'Die Datei kann nicht als Bild erkannt werden. Bitte verwenden sie nur gängige Dateiformate'
    //   );
    //   return;
    // }

    // // SET FILE NAME AS TEXT
    // this.fileText = this.selectedFile.name;

    // // SET FILE
    // var reader = new FileReader();
    // this.imagePath = files;

    // reader.readAsDataURL(files[0]);
    // reader.onload = (_event) => {
    //   this.imgURL = reader.result;
    // };

    this.bgImage = event;

    this.bgImageText = event.target.files[0].name;

    this.bgUrl = this.imageService.selectImage(event);

    console.log(this.bgUrl);
  }

  onSaveImage() {
    // const imagePath = this.imgURL;

    if (!this.isEditMode) {
      this.accountService.addBackgroundImage(this.bgImage);
    }
  }
  // ----------------------------------------------------------------------------------------------

  //#endregion

  //#region [ PRIVATE ] ///////////////////////////////////////////////////////////////////////////

  // ----------------------------------------------------------------------------------------------

  //#endregion
}

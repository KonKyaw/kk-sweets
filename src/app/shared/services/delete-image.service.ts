import { Injectable } from '@angular/core';
import { deleteObject, getStorage, ref } from '@angular/fire/storage';
import { AppProduct } from 'shared/models/app-product';

@Injectable({
  providedIn: 'root'
})
export class DeleteImageService {
  private storage = getStorage();

  constructor() { }

  async deleteImage(downloadUrl: string): Promise<any> {
    const Ref = ref(this.storage, downloadUrl);

    deleteObject(Ref).then(() => {
      // File deleted successfully
      console.log("image deleted successfully")
    }).catch((error) => {
      // Uh-oh, an error occurred!
      console.log("error occurred while deleting image")
    });
  }
}

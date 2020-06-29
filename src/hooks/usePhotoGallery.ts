import { useState, useEffect } from "react";
import { useCamera } from '@ionic/react-hooks/camera';
import { useFilesystem, base64FromPath } from '@ionic/react-hooks/filesystem';
import { useStorage } from '@ionic/react-hooks/storage';
import { isPlatform } from '@ionic/react';
import { CameraResultType, CameraSource, CameraPhoto, Capacitor, FilesystemDirectory } from "@capacitor/core";

export function usePhotoGallery() {

    let PHOTO_STORAGE = "photos";
    const { get, set, remove } = useStorage();
    const { deleteFile, getUri, readFile, writeFile } = useFilesystem();
    const { getPhoto } = useCamera();
    const [photos, setPhotos] = useState<Photo[]>([]);
    
    let selectedFilePath: string;
    let selectedDir: undefined;

    useEffect(() => {
        const loadSaved = async () => {
          const photosString = await get(PHOTO_STORAGE);
          let photos = (photosString ? JSON.parse(photosString) : []) as Photo[];
          console.log(photos)
          for (let photo of photos) {
            const file = await readFile({
              path: photo.filepath,
              directory: FilesystemDirectory.Data
            });
            photo.base64 = `data:image/jpeg;base64,${file.data}`;
          }
          setPhotos(photos);
        };
        loadSaved();
      }, [get, readFile]);

    const takePhoto = async () => {
        const cameraPhoto = await getPhoto({
          resultType: CameraResultType.Uri,
          source: CameraSource.Camera,
          quality: 100
        });
      
        const fileName = new Date().getTime() + '.jpeg';
        const savedFileImage = await savePicture(cameraPhoto, fileName);
        const newPhotos = [savedFileImage, ...photos];
        setPhotos(newPhotos);

        set(PHOTO_STORAGE, JSON.stringify(newPhotos.map(p => {
            // Don't save the base64 representation of the photo data, 
            // since it's already saved on the Filesystem
            const photoCopy = { ...p };
            delete photoCopy.base64;
            return photoCopy;
          })));
      };
      const deletePhoto = async () => {

        // delete all photos
        
              const photosString = await get(PHOTO_STORAGE);
              let photos = (photosString ? JSON.parse(photosString) : []) as Photo[];
              console.log(photos)
              //await set(PHOTO_STORAGE, "");

            for(var i = 0; i < photos.length; i++)
            {
                if(photos[i].filepath == selectedFilePath){
                    console.log(PHOTO_STORAGE)
                    
                    delete photos[i];
                    photos = photos.filter(function (el) {
                        return el != null;
                      });
                    
                   

                    set(PHOTO_STORAGE, JSON.stringify(photos.map(p => {
                        // Don't save the base64 representation of the photo data, 
                        // since it's already saved on the Filesystem
                        const photoCopy = { ...p };
                        delete photoCopy.base64;
                        return photoCopy;
                      })));
                }

                const reload = async () => {
                    const photosString = await get(PHOTO_STORAGE);
                    let photos = (photosString ? JSON.parse(photosString) : []) as Photo[];
                    setPhotos(photos);
                  };
                  reload();
                
            }

        
              
      
    };
    const getInfo = async function (photo: any) {
        console.log(photo.filepath, photo.webviewPath)
        selectedFilePath = photo.filepath;
        selectedDir = photo.webviewPath;
    };

    const savePicture = async (photo: CameraPhoto, fileName: string): Promise<Photo> => {
        const base64Data = await base64FromPath(photo.webPath!);
        const savedFile = await writeFile({
          path: fileName,
          data: base64Data,
          directory: FilesystemDirectory.Data
        });
      
        // Use webPath to display the new image instead of base64 since it's
        // already loaded into memory
        return {
          filepath: fileName,
          webviewPath: photo.webPath
        };
      };
  
    return {
      photos,
      takePhoto,
      deletePhoto,
      getInfo
    };
  }

  export interface Photo {
    filepath: string;
    webviewPath?: string;
    base64?: string;
  }
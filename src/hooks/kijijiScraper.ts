import { useState, useEffect } from "react";
import { useCamera } from '@ionic/react-hooks/camera';
import { useFilesystem, base64FromPath } from '@ionic/react-hooks/filesystem';
import { useStorage } from '@ionic/react-hooks/storage';
import { isPlatform } from '@ionic/react';
import { CameraResultType, CameraSource, CameraPhoto, Capacitor, FilesystemDirectory } from "@capacitor/core";
import { searchCircleOutline, informationOutline } from "ionicons/icons";
import { stringify } from "querystring";


export function KijijiScraper() {


    const [res, setListing] = useState<Listing[]>([]);
    const [info, setInfo] = useState<Information[]>([]);
    const kijiji = require("kijiji-scraper");
    /*var proxy = 'https://cors-anywhere.herokuapp.com/',
    target = 'https://www.kijiji.ca/v-view-details.html?adId=1505741625';
    var searchurl =  proxy + target;
    kijiji.Ad.Get(searchurl).then(function(ad: any) {
        // Use the ad object
        console.log(ad);
    }).catch(console.error);*/

    let options = {
        minResults: 10
    };
     
    let params = {
        locationId: 1700273,  // Same as kijiji.locations.ONTARIO.OTTAWA_GATINEAU_AREA.OTTAWA
        categoryId: 772,  // Same as kijiji.categories.CARS_AND_VEHICLES
        sortByName: "dateDesc"  // Show the cheapest listings first
    };
     
    const reload = async () => {


        let res:any[] = [];
        let info:any[] = [];
        let test, teststring, infoString;
        const getResults= await kijiji.search(params, options).then(function(ads: any) {
            // Use the ads array
            for (let i = 0; i < ads.length; ++i) {
                console.log(ads[i]);
                //res = ads[1].attributes.price;
                res[i] = {    
                            title: ads[i].title,
                            price: ads[i].attributes.price, 
                            image: ads[i].image, 
                            description: ads[i].description,
                       }
                info[i] = {    
                            description: ads[i].description,
                   }
            }
        }).catch(console.error);

        teststring = JSON.stringify(res);
        console.log(res)
        res = (teststring ? JSON.parse(teststring) : []) as Listing[];
        setListing(res);

        infoString = JSON.stringify(info);
        info = (infoString ? JSON.parse(infoString) : []) as Information[];
        setInfo(info);

        //res = (teststring ? JSON.parse(teststring) : []) as Listing[];
        //setListing(res);
  

    }









    return {
        res,
        info,
        reload
    };
}

export interface Information {
    description: string;
  }

export interface Listing {
    title: string;
    price: number;
    image: string;
    description: string;
  }
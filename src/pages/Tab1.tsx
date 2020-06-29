import React from 'react';
import ReactDOM from 'react-dom';
import { useState, useEffect } from "react";
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
      IonFab, IonFabButton, IonIcon, IonGrid, IonRow, IonCol, IonImg,
        IonList, IonItem, IonCheckbox, IonLabel, IonBadge, IonNote, IonAlert, IonModal, IonButton, IonVirtualScroll,
        IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonThumbnail, IonInfiniteScroll, IonSpinner } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab1.css';
import { KijijiScraper } from '../hooks/kijijiScraper';
import { cartOutline, cloudDownloadOutline } from 'ionicons/icons';

const Tab1: React.FC = () => {
  const { res, info, reload } = KijijiScraper();
  let des_print_val = "";
  const [showAlert1, setShowAlert1] = useState(false);

  const [showModal, setShowModal] = useState(false);
  let modalelement: any;

  

  async function descriptionAlert(i: any){
    des_print_val =  res[i].description;
    console.log(des_print_val)
    setShowModal(true)
    //alert(des_print_val);

    modalelement = (
      
      <IonModal isOpen={true} cssClass='modal'>
        <IonContent>
        <IonInfiniteScroll><p>{des_print_val}</p></IonInfiniteScroll>
        </IonContent>
            <IonButton onClick={() => closeModal()}>Close Modal</IonButton>
          </IonModal>
    );
    console.log(modalelement)
    ReactDOM.render(modalelement, document.getElementById('container'));
    await doathing(modalelement);
}

async function doathing(modalelement: any){

  setShowModal(true);
}

  function closeModal(){
    console.log("close")
    
const element = (
  
  <IonModal isOpen={false} cssClass='modal'>
  <IonInfiniteScroll><p>{des_print_val}</p></IonInfiniteScroll>
        <IonButton onClick={() => closeModal()}>Close Modal</IonButton>
      </IonModal>
);
    ReactDOM.render(element, document.getElementById('container'));

  }


  async function getListings(){
    const element = (
  
      <IonSpinner />
    );
        ReactDOM.render(element, document.getElementById('loading'));
    await reload();
    secondFunction();    
}

async function secondFunction(){
        console.log("here");
        document.getElementById('loading')?.remove();  
}

  return (
    <IonPage id="root">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Kijiji</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>

        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Kijiji Scraper</IonTitle>
          </IonToolbar>
        </IonHeader>


        <div id="container"></div>
        <div id="loading"></div>
    {Object.keys(res).map((keyName, i) => (    
    <IonCard key={i} onClick={() => descriptionAlert(keyName)}>
        <IonCardHeader>


        <IonCardSubtitle><div className="subtitle">${res[keyName].price}</div></IonCardSubtitle>
        <IonCardTitle><div className="title"><p>{res[keyName].title}</p></div><div className="image"> <a><img src={res[keyName].image}></img></a></div></IonCardTitle>

          </IonCardHeader>
          
          <IonCardContent>
          
    </IonCardContent>

    </IonCard>
    ))}



        <IonFab vertical="bottom" horizontal="center" slot="fixed">
          <IonFabButton onClick={() => KijijiScraper()}>
          <IonIcon icon={cartOutline}></IonIcon>
          </IonFabButton>
          </IonFab>

  <IonFab vertical="bottom" horizontal="end" slot="fixed">
    <IonFabButton onClick={() => getListings()}>
      <IonIcon icon={cloudDownloadOutline}></IonIcon>
    </IonFabButton>
  </IonFab>

      </IonContent>
    </IonPage>
  );


};






export default Tab1;

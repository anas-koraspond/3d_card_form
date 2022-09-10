export const onReturnAnimation = (callback) => {
    const Frame = document.querySelector('.App_Frame');
    const Return = document.querySelector('.App_Button--Return');
    const Gui = document.querySelector('.Gui');
    const Card = document.querySelector('.Card');
  
    Return.classList.remove('App_Button--Show');
    Frame.classList.add('App_Animate--Hide');
    Frame.classList.remove('App_Animate');
    Gui.classList.remove('Gui_Animate');
  
  
    setTimeout(() => {
    //   Gui.classList.remove('Gui_Animate--Hide');
      callback(false)
    //   Frame.classList.remove('App_Animate--Hide');
    //   Card.classList.remove('Card_Animate--Center');
    //   Frame.classList.remove('App_Frame--Clear ');
    }, 500)
  }
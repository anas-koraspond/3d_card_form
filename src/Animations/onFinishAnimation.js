export const onFinishAnimation = (callback) => {
    const Card = document.querySelector('.Card');
    const Frame = document.querySelector('.App_Frame');
    const Return = document.querySelector('.App_Button--Return');
    const Gui = document.querySelector('.Gui');
    setTimeout(() => {
      Gui.classList.add('Gui_Animate--Hide');
      setTimeout(() => {
      Gui.classList.remove('Gui_Animate');
      callback()
  
      setTimeout(() => {
        Return.classList.add('App_Button--Show')
        Card.classList.add('Card_Animate--Center');
        Frame.classList.add('App_Frame--Clear ')
      }, 300)
      }, 500)
    }, 500)
  }
  
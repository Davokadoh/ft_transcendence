const chat = (
`
<div class="container-fluid px-0 mx-0">
  <div class="row g-0">
    
    <!-- start col-md-4 -->
    <div class="col-md-4 border-end">
      <!-- nested row1 -->
      <div class="row row-nest1 g-0"> 
        <div class="col-md-12">
          <div class="settings-tray settings-tray--left d-flex align-items-center">
            <img class="profile-image" src="https://img.freepik.com/vecteurs-premium/logo-mascotte-dessin-anime-kawaii-creatif-mignon-voleur-chat-blanc_152710-1459.jpg" alt="Profile image">
            <span class="icons ms-auto">
              <i class="bi bi-chat-left-quote" data-toggle="tooltip" title="Chat"></i>
              <i class="bi bi-broadcast" data-toggle="tooltip" title="Channel"></i>
              <i class="bi bi-three-dots-vertical" 
               data-toggle="tooltip" 
               title="Menu"
               id="menuButtonLeft"
               data-bs-toggle="dropdown"
               aria-expanded="false">
              </i>
               <ul class="dropdown-menu" aria-labelledby="menuButtonLeft">
                <li><a class="dropdown-item" href="#">Action</a></li>
                <li><a class="dropdown-item" href="#">Another action</a></li>
                <li><a class="dropdown-item" href="#">Something else here</a></li>
              </ul>
              
            </span>
          </div>
        </div>
      </div>
      
      <!-- nested row2 -->
      <div class="row row-nest2 g-0"> 
        <div class="col-md-12 g-0">
          <div class="search-box">
            <div class="input-wrapper">
              <i class="search bi-search-heart"></i>
              <input type="text" placeholder="Search here">
            </div>
          </div>
        </div>
      </div>
    
      <!-- nested row3 -->
      <div class="row row-nest3 g-0"> 
        <div class="col-md-12">
          <div>
            <div class="friend-drawer friend-drawer--onhover">
              <img src="https://upload.chatsdumonde.com/img_global/24-comportement/_light-18718-chat-qui-vole-objet-nourriture.jpg" alt="Friend photo" class="profile-image">
              <div class="text">
                <h6>Wanted Cat</h6>
                <p class="text-muted">Hey, you're arrested </p>
              </div>
              <div class="d-flex flex-column">
                <span class="time-msg small">13:21</span>
                <i class="i-down bi-chevron-down"
                 id="menuDownLeft"
                 data-bs-toggle="dropdown"
                 aria-expanded="false">
                </i>
                <ul class="dropdown-menu" aria-labelledby="menuDownLeft">
                 <li><a class="dropdown-item" href="#">Supprimer la discussion</a></li>
                 <li><a class="dropdown-item" href="#">Marquer comme non lue</a></li>
                 <li><a class="dropdown-item" href="#">Bloquer</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div> 
    <!-- col-md-4 close -->
    
    <!-- start col-md-8 -->
    <div class="col-md-8">
      <!-- nested row1 -->
      <div class="row row-nest-r1 g-0">
        <div class="col-md-12">
          <div class="settings-tray settings-tray--right d-flex align-items-center">
            <img class="profile-image" src="https://upload.chatsdumonde.com/img_global/24-comportement/_light-18718-chat-qui-vole-objet-nourriture.jpg" alt="Friend Image" data-toggle="tooltip" title="Detail du profil">
            <div class="text">
              <h6>Wanted Cat</h6>
            </div>
            
            <span class="dropdown ms-auto">
              <i class="bi bi-three-dots-vertical" 
                data-toggle="tooltip" 
                title="Menu"
                id="menuButtonRight"
                data-bs-toggle="dropdown"
                aria-expanded="false">
              </i>
              <ul class="dropdown-menu" aria-labelledby="menuButtonRight">
                <li><a class="dropdown-item" href="#">Action</a></li>
                <li><a class="dropdown-item" href="#">Another action</a></li>
                <li><a class="dropdown-item" href="#">Something else here</a></li>
              </ul>
            </span>
          </div>  
        </div>
      </div>
      
      <!-- nested row2 -->
      <div class="row row-nest-r2 g-0">
        <div class="col-md-12">
          
          <!-- start chat panel -->
          <div class="chat-panel">
            
            <div class="row g-0"> <!--msg from friend-->
              <div class="col-md-3 d-flex">
                <div class="chat-bubble chat-bubble--left">
                  Hello cat!
                </div>
              </div>
            </div>
            
            <!--msg from me -->
            <div class="row g-0"> 
              <div class="col-md-3 offset-md-9">
                <div class="chat-bubble chat-bubble--blue chat-bubble--right">
                  wsup!
                </div>
              </div>
            </div>
    
          </div> 
          <!-- chat panel close -->

        </div>
      </div>
      
      <!-- nested row3 -->
      <div class="row row-nest-r3 g-0">
        <div class="col-md-12">
          <!-- message bar -->
          <div class="chat-box d-flex align-items-center justify-content-center">
            <!-- <i class="i-emoji bi-emoji-sunglasses" id="emoji_id"></i> -->
            <input class="inputCustom" id="input_id"/>
            <i class="i-send bi-send"></i>
          </div>
          <!-- close message bar -->
        </div>
      </div>
    </div>  
    <!-- col-md-8 close -->   
    
  </div>
</div>
`
);
export default chat;

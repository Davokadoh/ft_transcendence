const chat = (
`
<div class="container-fluid px-0 mx-0">
  <div class="row g-0">
    
    <!-- start col-md-4 -->
    <div class="col-md-4 border-end">
    
      <!-- nested row1 -->
      <div class="row row-trayLeft g-0"> 
        <div class="col-md-12">
          
          <div class="settings-tray settings-tray--left d-flex align-items-center">
            <img class="profile-image" src="https://img.freepik.com/vecteurs-premium/logo-mascotte-dessin-anime-kawaii-creatif-mignon-voleur-chat-blanc_152710-1459.jpg" alt="Profile image">
            <span class="icons ms-auto">
              <i class="i-chat bi-chat-left-quote" id="chat-id" data-toggle="tooltip" title="Chat"></i>
              <i class="i-channel bi-broadcast" id="idChannel" data-toggle="tooltip" title="Channel"></i>
              <i class="i-menu bi-three-dots-vertical" 
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
      <div class="row row-chatChannel g-0"> 
        <div class="col-md-12">

          <div class="chat visible">
            
            <div class="search search--chatContact">
              <div class="input-wrapper">
                <i class="search bi-search-heart"></i>
                <input type="text" id="searchContact" 
                  placeholder="Search contact here"
                  data-search>
                </input>
              </div>
            </div>

            <div class="list-contact invisible-y"
              id="listContact" list-contact-container>
            <template list-contact-template>
              <div class="contact friend --onhover border-top d-flex align-items-center" id="contactId">
                <img src="" 
                  alt="Friend photo"
                  class="profile-image"
                  data-image>
                <div class="text" data-name></div>
              </div>
            </template>
            </div>

            <div class="conversation-list visible-x" id="conversationListId">
            <template conversation-template>
              <div class="conversation friend --onhover d-flex" id="msgId">
                <img src="" alt="Friend photo" class="profile-image" data-image>
                <div class="text" data-text>
                  <h6>Wanted Cat</h6>
                  <p class="text-muted">Hey, you're arrested </p>
                </div>
                <div class="d-flex flex-column ms-auto">
                  <span class="time-msg small">13:21</span>
                  <i class="i-down bi-chevron-down"
                  id="menuDownLeft"
                  data-bs-toggle="dropdown"
                  aria-expanded="false">
                  </i>
                  <ul class="dropdown-menu" aria-labelledby="menuDownLeft">
                  <li><button class="dropdown-item" type="button">Supprimer la discussion</button></li>
                  <li><button class="dropdown-item" type="button">Marquer comme non lue</button></li>
                  <li><button class="dropdown-item" type="button">Bloquer</button></li>
                  </ul>
                </div>
              </div>
            </template>
            </div>

          </div>

          <div class="channel">
            <div class="search search--channel">
              <div class="input-wrapper">
                <i class="search bi-search-heart"></i>
                <input type="text" placeholder="Search channel here">
              </div>
            </div>
            <h6>TEST CHANNEL</>
          </div>


        </div>
      </div>
      
    </div> 
    <!-- col-md-4 close -->
    
    <!-- start col-md-8 -->
    <div class="col-md-8">
      
      <!--display principal first session-->
      <div class="panel-principal col-md-12 g-0" id="panelPrincipalId"></div>

      <div class="conversation-history" data-conversation-history></div> 
      <!-- close conversation-history -->

      <!-- nested row3 -->
      <div class="row row-chatBox g-0">
        <div class="col-md-12">
          <!-- message bar -->
          <div class="chat-box d-flex align-items-center justify-content-center hide" id="chatBoxId">
            <!-- <i class="i-emoji bi-emoji-sunglasses" id="emoji-id"></i> -->
            <input class="inputCustom" id="input-id"/>
            <i class="i-send bi-send" id="send-id"></i>
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

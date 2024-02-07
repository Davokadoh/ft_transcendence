const chat = (
`
<div class="container-fluid px-0 mx-0">
  <div class="row g-0">
    
    <!-- start col-md-4 -->
    <div class="col-md-4">
    
      <!-- nested row1 -->
      <div class="row row-trayLeft g-0"> 
        <div class="col-md-12">
          
          <div class="settings-tray settings-tray--left d-flex align-items-center">
            <img class="profile-image" src="https://img.freepik.com/vecteurs-premium/logo-mascotte-dessin-anime-kawaii-creatif-mignon-voleur-chat-blanc_152710-1459.jpg" alt="Profile image">
            <span class="icons ms-auto">
              <i class="i-chat bi-chat-left-quote" id="i-chatId" data-toggle="tooltip" title="Chat"></i>
              <i class="i-channel bi-broadcast" id="i-channelId" data-toggle="tooltip" title="Channel"></i>
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

          <div class="chat" id="chatId">
            
            <div class="search" id="searchContactId">
              <div class="input-wrapper">
                <i class="search bi-search-heart"></i>
                <input type="text" id="searchContact" 
                  placeholder="Search contact here"
                  data-search>
                </input>
              </div>
            </div>

            <div class="list-contact invisible-y" id="listContact" list-contact-container>
            <template list-contact-template>
              <div class="contact --onhover friend border-top d-flex align-items-center" id="contactId">
                <img src="" 
                  alt="Friend photo"
                  class="profile-image"
                  data-image>
                <div class="text" data-name></div>
              </div>
            </template>
            </div>

            <div class="conversation-list visible-x" id="conversationListId">
            </div>

          </div>

          <div class="channel invisible-x" id="channelId">
            <div class="search" id="seachChannelId">
              <div class="input-wrapper">
                <i class="search bi-search-heart"></i>
                <input type="text" placeholder="Search channel here">
              </div>
            </div>
            <div class="add-channel d-flex justify-content-center align-items-center" id="addChannelId">
              <i class="i-add bi-patch-plus-fill" id="i-addId" type="button"></i>
            </div>

            <div class="channel-list --onhover d-flex flex-column" id="channelListId">
              <img src="https://img.freepik.com/vecteurs-premium/logo-mascotte-dessin-anime-kawaii-creatif-mignon-voleur-chat-blanc_152710-1459.jpg" alt="Friend photo" class="profile-image-channel" data-image>
              <h6>Wanted Cat</h6>
            </div>
            <div class="channel-list --onhover d-flex flex-column" id="channelListId">
              <img src="https://img.freepik.com/vecteurs-premium/logo-mascotte-dessin-anime-kawaii-creatif-mignon-voleur-chat-blanc_152710-1459.jpg" alt="Friend photo" class="profile-image-channel" data-image>
              <h6>Wanted Cat</h6>
            </div>

            <div class="home-channel hide d-flex flex-column align-items-center">
              <i class="i-home-channel bi-broadcast"></i>
              
              <i class="cam bi-camera-fill" id="camId"></i>
              <input type="file" accept="image/jpg, image/jpeg, image/png" id="inputFileId">
              
              <div class="circle" id="circleId">
                <img id="imageUploadedId" src="put image here">
              </div>

              <div class="form__group field">
                <input type="input" class="form__field" placeholder="Channel name" name="name" id='nameInputId' required />
                <label for="nameInputId" class="form__label">Channel name</label>
              </div>
            
            </div>
          </div>


        </div>
      </div>
      
    </div> 
    <!-- col-md-4 close -->
    
    <!-- start col-md-8 -->
    <div class="col-md-8">
      
      <!--first panel display-->
      <div class="panel-principal col-md-12 g-0" id="panelPrincipalId"></div>
      
      <!-- conversation-history -->
      <div class="conversation-history" data-conversation-history></div> 

    </div>  
    <!-- col-md-8 close -->   
    
  </div>
</div>
`
);

export default chat;

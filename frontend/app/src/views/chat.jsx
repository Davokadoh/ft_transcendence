const chat = (
	`
<div class="container">
  <div class="row no-gutters">

    <!-- start col-md-4 -->
    <div class="col-md-4 border-right">
      <div class="settings-tray">
        <img class="profile-image" src="https://img.freepik.com/vecteurs-premium/logo-mascotte-dessin-anime-kawaii-creatif-mignon-voleur-chat-blanc_152710-1459.jpg" alt="Profile image">
        <span class="settings-tray--right float-end">
          <i class="material-symbols-outlined">cached</i>
          <i class="material-symbols-outlined">message</i>
          <i class="material-symbols-outlined">Groups</i>
          <i class="material-symbols-outlined">menu</i>
        </span>
      </div>

      <div class="search-box">
        <div class="input-wrapper">
          <i class="material-symbols-outlined">search</i>
          <input type="text" placeholder="Search here">
        </div>
      </div>

      <div>
        <div class="friend-drawer friend-drawer--onhover">
          <img src="https://upload.chatsdumonde.com/img_global/24-comportement/_light-18718-chat-qui-vole-objet-nourriture.jpg" alt="Friend photo" class="profile-image">
          <div class="text">
            <h6>Wanted Cat</h6>
            <p class="text-muted">Hey, you're arrested!</p>
          </div>
          <span class="time-msg small">13:21</span>
      </div>
      <div>
        <div class="friend-drawer friend-drawer--onhover">
          <img src="https://upload.chatsdumonde.com/img_global/24-comportement/_light-18718-chat-qui-vole-objet-nourriture.jpg" alt="Friend photo" class="profile-image">
          <div class="text">
            <h6>Wanted Cat2</h6>
            <p class="text-muted">Hey, guys!</p>
          </div>
          <span class="time-msg small">13:21</span>
        </div>
      </div>
     </div>
    </div>
    <!-- col-md-4 close -->

    <!-- start col-md-8 -->
    <div class="col-md-8">
      <div class="settings-tray">
        <div class="friend-drawer no-gutters friend-drawer--grey">
          <img class="profile-image" src="https://upload.chatsdumonde.com/img_global/24-comportement/_light-18718-chat-qui-vole-objet-nourriture.jpg" alt="Friend Image">
          <div class="text">
            <h6>Wanted Cat</h6>
            <p>Just test status msg blabalabla...</p>
          </div>
          <span class="float-end">
            <i class="material-symbols-outlined">search</i>
            <i class="material-symbols-outlined">menu</i>
          </span>
        </div>
      </div>

    <!-- start chat panel -->
    <div class="chat-panel">

      <div class="row no-gutters">
        <div class="col-md-3">
          <div class="chat-bubble chat-bubble--left">
            Hello cat!
          </div>
        </div>
      </div>
      <div class="row no-gutters">
        <div class="col-md-3 offset-md-9">
          <div class="chat-bubble chat-bubble--blue chat-bubble--right">
            wsup!
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-16">
          <div class="chat-box-tray">
            <i class="material-symbols-outlined">sentiment_stressed </i>
            <input type="text" placeholder="Type your message..." />
            <i class="material-symbols-outlined">mic </i>
            <i class="material-symbols-outlined">send </i>
          </div>
        </div>
      </div>

    </div>
</div>
`
);
export default chat;

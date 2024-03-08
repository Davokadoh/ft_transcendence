from django.forms import ModelForm, ImageField, FileInput
from .models import User


class NicknameForm(ModelForm):
    def __init__(self, *args, **kwargs):
        super(NicknameForm, self).__init__(*args, **kwargs)
        for visible in self.visible_fields():
            visible.field.widget.attrs["class"] = "form-control form-control-sm"

    class Meta:
        model = User
        fields = ["nickname"]


class ProfilPictureForm(ModelForm):
    profil_picture = ImageField(widget=FileInput)
    def __init__(self, *args, **kwargs):
        super(ProfilPictureForm, self).__init__(*args, **kwargs)
        for visible in self.visible_fields():
            visible.field.widget.attrs["class"] = "form-control form-control-sm"

    class Meta:
        model = User 
        fields = ["profil_picture"]
        
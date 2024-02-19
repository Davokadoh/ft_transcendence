from django.forms import ModelForm, ImageField, FileInput
from .models import User


class UsernameForm(ModelForm):
    def __init__(self, *args, **kwargs):
        super(UsernameForm, self).__init__(*args, **kwargs)
        for visible in self.visible_fields():
            visible.field.widget.attrs["class"] = "form-control form-control-sm"

    class Meta:
        model = User
        fields = ["username"]


class ProfilPictureForm(ModelForm):
    profil_picture = ImageField(widget=FileInput)
    def __init__(self, *args, **kwargs):
        super(ProfilPictureForm, self).__init__(*args, **kwargs)
        for visible in self.visible_fields():
            visible.field.widget.attrs["class"] = "form-control form-control-sm"

    class Meta:
        model = User 
        fields = ["profil_picture"]
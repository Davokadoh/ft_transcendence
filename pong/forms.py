from django.forms import ModelForm
from .models import User


class UsernameForm(ModelForm):
    def __init__(self, *args, **kwargs):
        super(UsernameForm, self).__init__(*args, **kwargs)
        for visible in self.visible_fields():
            visible.label = ""
            visible.field.widget.attrs["class"] = "form-control form-control-sm"

    class Meta:
        model = User
        fields = ["username"]

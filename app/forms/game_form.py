from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, SelectField
from wtforms.validators import InputRequired, Optional, Length, ValidationError

# Email validator can be customized as needed
def email_validator(form, field):
    email = field.data
    # Example condition: Uncomment and modify for your validation logic
    # if not email.endswith('@something.com'):
    #     raise ValidationError('Email must be from something.com domain.')


class GameForm(FlaskForm):
    # Basic restaurant information
    title = StringField('Title', validators=[InputRequired(), Length(min=1, max=95)])
    image = StringField('Image Url', validators=[Optional()])
    description = TextAreaField('Description', validators=[InputRequired(), Length(max=500)])
    genre = StringField('Genre', validators=[InputRequired(), Length(min=1, max=100)])
    platform = StringField('Platform', validators=[InputRequired(), Length(min=1, max=100)])
    price = StringField('Price', validators=[Optional(), Length(min=10, max=15)])



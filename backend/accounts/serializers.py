from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password_confirm')
        extra_kwargs = {
            'email': {'required': True},
            'username': {'required': True},
        }

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({"confirmPassword": "Passwords do not match."})
        
        # User validation (email uniqueness is handled by model, but we can be explicit if needed)
        return data

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        return User.objects.create_user(**validated_data)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = User.EMAIL_FIELD

    def validate(self, attrs):
        # The base class uses the username field (which we set to email)
        data = super().validate(attrs)
        data['user'] = {
            'id': self.user.id,
            'username': self.user.username,
            'email': self.user.email,
        }
        return data


class ProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("username", "bio", "location", "website")


class ProfileImageUploadSerializer(serializers.ModelSerializer):
    profile_picture = serializers.ImageField(allow_empty_file=False)

    class Meta:
        model = User
        fields = ("profile_picture",)

    def validate_profile_picture(self, image):
        allowed_extensions = {".jpg", ".jpeg", ".png", ".webp"}
        extension = "." + image.name.rsplit(".", 1)[-1].lower() if "." in image.name else ""
        if extension not in allowed_extensions:
            raise serializers.ValidationError("Use a JPG, PNG, or WEBP image.")
        if getattr(image.image, "format", "").lower() not in {"jpeg", "png", "webp"}:
            raise serializers.ValidationError("Use a valid JPG, PNG, or WEBP image.")
        if image.size > 5 * 1024 * 1024:
            raise serializers.ValidationError("The image must be 5 MB or smaller.")
        return image

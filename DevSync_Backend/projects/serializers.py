from rest_framework import serializers
from .models import Project

class ProjectCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = [
            'name', 'description', 'visibility','template' ,'gitignore', 'license',
            'readme', 'issues_enabled', 'wiki_enabled', 'boards_enabled',
            'discussions_enabled', 'auto_init','logo',
        ]

    def create(self, validated_data):
        user = self.context['request'].user
        project = Project.objects.create(created_by=user, **validated_data)
        project.members.add(user)
        return project

class ProjectListSerializer(serializers.ModelSerializer):
    created_by = serializers.StringRelatedField()

    class Meta:
        model = Project
        fields = ['project_id', 'name', 'slug', 'visibility', 'created_by', 'created_at', 'logo']

class ProjectDetailSerializer(serializers.ModelSerializer):
    created_by = serializers.StringRelatedField()

    class Meta:
        model = Project
        fields = '__all__'

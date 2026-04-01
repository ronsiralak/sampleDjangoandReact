from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from .models import Item


class ItemAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.item = Item.objects.create(name='Test Item', description='A test description')

    def test_list_items(self):
        res = self.client.get('/api/items/')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(len(res.data), 1)

    def test_create_item(self):
        res = self.client.post('/api/items/', {'name': 'New Item', 'description': 'New desc'}, format='json')
        self.assertEqual(res.status_code, 201)
        self.assertEqual(Item.objects.count(), 2)
        self.assertEqual(res.data['name'], 'New Item')

    def test_retrieve_item(self):
        res = self.client.get(f'/api/items/{self.item.id}/')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data['name'], 'Test Item')

    def test_delete_item(self):
        res = self.client.delete(f'/api/items/{self.item.id}/')
        self.assertEqual(res.status_code, 204)
        self.assertEqual(Item.objects.count(), 0)

    def test_create_item_name_required(self):
        res = self.client.post('/api/items/', {'description': 'No name'}, format='json')
        self.assertEqual(res.status_code, 400)

<?php

namespace Tests\Feature;

use App\Models\Danhmuc;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DanhMucControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_lists_root_categories_children_and_a_category_detail(): void
    {
        $root = $this->createCategory([
            'ten_danh_muc' => 'Xe may',
            'duong_dan' => 'xe-may',
        ]);
        $child = $this->createCategory([
            'ten_danh_muc' => 'Xe tay ga',
            'duong_dan' => 'xe-tay-ga',
            'ma_danh_muc_cha' => $root->getKey(),
        ]);

        $this->getJson('/api/categories')
            ->assertOk()
            ->assertJsonPath('data.0.ma_danh_muc', $root->getKey());

        $this->getJson('/api/categories/parents')
            ->assertOk()
            ->assertJsonPath('data.0.ma_danh_muc', $root->getKey())
            ->assertJsonPath('data.0.children_count', 1);

        $this->getJson("/api/categories/{$root->getKey()}/children")
            ->assertOk()
            ->assertJsonPath('parent.ma_danh_muc', $root->getKey())
            ->assertJsonPath('data.0.ma_danh_muc', $child->getKey());

        $this->getJson("/api/categories/{$child->getKey()}")
            ->assertOk()
            ->assertJsonPath('data.ma_danh_muc', $child->getKey())
            ->assertJsonPath('data.parent.ma_danh_muc', $root->getKey())
            ->assertJsonPath('data.children_count', 0)
            ->assertJsonPath('data.san_phams_count', 0);
    }

    public function test_write_routes_require_authentication(): void
    {
        $this->postJson('/api/categories', [
            'ten_danh_muc' => 'Xe con',
            'duong_dan' => 'xe-con',
        ])->assertUnauthorized();
    }

    public function test_it_creates_updates_and_soft_deletes_a_category(): void
    {
        $this->withoutMiddleware();

        $created = $this->postJson('/api/categories', [
            'ten_danh_muc' => 'Xe con',
            'duong_dan' => 'xe-con',
            'mo_ta' => 'Danh muc xe con',
        ])->assertCreated();

        $categoryId = $created->json('data.ma_danh_muc');

        $this->patchJson("/api/categories/{$categoryId}", [
            'ten_danh_muc' => 'O to',
            'duong_dan' => 'o-to',
            'trang_thai' => 'an',
        ])->assertOk()
            ->assertJsonPath('data.ten_danh_muc', 'O to')
            ->assertJsonPath('data.trang_thai', 'an');

        $this->deleteJson("/api/categories/{$categoryId}")
            ->assertNoContent();

        $this->assertSoftDeleted('danh_muc', [
            'ma_danh_muc' => $categoryId,
        ], 'ngay_xoa');
    }

    public function test_it_rejects_a_category_cycle_and_a_parent_with_children(): void
    {
        $this->withoutMiddleware();

        $root = $this->createCategory([
            'ten_danh_muc' => 'Xe may',
            'duong_dan' => 'xe-may',
        ]);
        $child = $this->createCategory([
            'ten_danh_muc' => 'Xe so',
            'duong_dan' => 'xe-so',
            'ma_danh_muc_cha' => $root->getKey(),
        ]);

        $this->patchJson("/api/categories/{$root->getKey()}", [
            'ma_danh_muc_cha' => $child->getKey(),
        ])->assertUnprocessable()
            ->assertJsonValidationErrors('ma_danh_muc_cha');

        $this->deleteJson("/api/categories/{$root->getKey()}")
            ->assertStatus(409);
    }

    private function createCategory(array $attributes): Danhmuc
    {
        return Danhmuc::query()->create($attributes + [
            'trang_thai' => 'hoat_dong',
        ]);
    }
}

<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'ho_ten' => fake()->name(),
            'ten_dang_nhap' => fake()->unique()->userName(),
            'dia_chi_email' => fake()->unique()->safeEmail(),
            'thoi_gian_xac_thuc' => now(),
            'mat_khau' => static::$password ??= Hash::make('password'),
            'ma_nho_dang_nhap' => Str::random(10),
            'vai_tro' => 'thanh_vien',
            'trang_thai' => 'hoat_dong',
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'thoi_gian_xac_thuc' => null,
        ]);
    }
}

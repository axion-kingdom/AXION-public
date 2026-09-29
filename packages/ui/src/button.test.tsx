import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import React from 'react';
import { Button } from './button.js';

describe('Button — بوابة الجسر (درس حادثة binarjoinanalytic)', () => {
  it('asChild يمرر طفلاً واحداً — لا انهيار Slot مع المصفوفات', () => {
    // لو عاد نمط «مصفوفة الأطفال»، لرمى Slot: Expected a single React element child
    const html = renderToString(
      <Button asChild>
        <a href="#demo">رابط</a>
      </Button>
    );
    expect(html).toContain('href="#demo"');
    expect(html).toContain('رابط');
  });

  it('الزر العادي يحتفظ بميزة التحميل', () => {
    const html = renderToString(<Button loading>حفظ</Button>);
    expect(html).toContain('animate-spin');
  });
});

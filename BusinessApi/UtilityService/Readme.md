# UtilityService

UtilityService, içerisinden birden çok yardımcı işlev bulunduran bir mikroservistir. Uygulamanın ön yüzü **Material-UI (MUI)** ve **TypeScript** kullanılarak oluşturulmuştur.

## Kullanılan Teknolojiler
- **Spring Boot**
- **Material-UI (MUI)** (ön yüz bileşenleri için)
- **TypeScript**
- **PostgreSQL** (veritabanı)
- **JWT** (kimlik doğrulama)
- **EmailSender** (geri bildirim ve durum güncellemeleri için e-posta bildirimi)

## İş Mantığı (Business Logic)

### Bug Report (Hata Raporu)
- Kullanıcılar, sağ üstteki profil menüsünden hata raporu (bug report) gönderebilir.
- Gönderilen hata raporları, **admin** paneline iletilir ve burada yönetilebilir.

### Admin Paneli
- Admin, gelen hata raporlarını görüntüleyebilir, durumlarını güncelleyebilir ve kullanıcıya geri bildirim sağlayabilir.
- Durum güncellemeleri, raporun ilerleme durumunu gösterir (örneğin, "Açık", "İlgileniliyor", "Kapatıldı").
- Admin, rapor için geri bildirim eklediğinde veya çözüldüğünde, bu bilgi e-posta yoluyla kullanıcıya iletilir.
- Kapanmış bir hata raporu, gerekirse yeniden açılabilir ve versiyonu artırılarak takip edilebilir.

## Kullanım
1. **Kullanıcılar**: Profil menüsünden hata raporu gönderir.
2. **Adminler**:
    - Hata raporlarını inceler ve yönetir.
    - Hata durumunu güncelleyip kullanıcıya geri bildirim sağlar.
    - Gerektiğinde kapanmış raporları yeniden açarak versiyon numarasını artırır.
3. **E-posta Bildirimi**: Admin tarafından eklenen geri bildirimler otomatik olarak kullanıcıya e-posta yoluyla bildirilir.

## Gelecekteki Geliştirmeler
- Hata raporlarının detaylı analizini ve raporlamasını sağlayacak istatistiksel özellikler eklenebilir.

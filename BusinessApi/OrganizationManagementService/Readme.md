# Organization Management Service

Organization Management Service, organizasyon yapısını yönetmek için geliştirilmiş bir mikroservis uygulamasıdır. Departman ve personel yönetimi yapabilir, organizasyon şeması oluşturabilir ve güncelleyebilirsiniz. Ön yüzde **React - Typescript**, **Material-UI** (MUI) ve **PrimeReact** kütüphanesi kullanılarak görselleştirme sağlanmıştır. Özellikle organizasyon şeması için **PrimeReact Organization Chart** bileşeni kullanılmıştır.

## Kullanılan Teknolojiler
- **Spring Boot**
- **Spring Security**
- **RabbitMQ**
- **Material-UI (MUI)** (DataGrid için)
- **PrimeReact** (Organization Chart için)
- **PostgreSQL** (veritabanı)
- **JWT** (kimlik doğrulama)
- **EmailSender** (personel hesap oluşturma/deaktif etme)

## İş Mantığı (Business Logic)

### Departmanlar
- Kullanıcı, organizasyondaki departmanları sisteme ekleyebilir ve güncelleyebilir.
- Her departman, organizasyon yapısındaki yerini korur ve ilgili personel yönetimi yapılabilir.

### Personel
- Personeller sisteme eklenip güncellenebilir.
- Personellerin yöneticileri güncellenebilir ve bu değişiklikler **organizasyon şemasına** otomatik olarak yansır.
- Yeni eklenen personellere, sisteme dahil olmaları için hesap bilgisi tanımlanabilir. Bu hesaplar gerektiğinde **deaktif** edilebilir.

### Organizasyon Şeması
- Organizasyon yapısındaki hiyerarşi, **PrimeReact Organization Chart** ile görselleştirilir. [PrimeReact Organization Chart](https://primereact.org/organizationchart/) bileşeni, kullanıcıların departmanlar ve personeller arasındaki ilişkileri görmesini sağlar.
- Sistemi satın alan kullanıcı, ilk olarak **TopManager** adlı en üst düzey yöneticiyi tanımlar. Ardından, diğer personelleri bu yöneticinin altına hiyerarşik bir yapı oluşturarak ekler.
- Organizasyon şeması üzerinden personel ve departman ekleyip çıkarabilirsiniz.

## Otomasyon ve Hesap Yönetimi
- Sisteme eklenen personellere birer kullanıcı hesabı verilir.
- Bu hesaplarla sisteme giriş yapabilirler.
- Hesaplar gerektiğinde aktif veya deaktif edilebilir, bu sayede yetkilendirme yönetimi sağlanır.

## Kullanım
1. Sisteme departmanlar ve personeller ekleyin.
2. Personel hiyerarşisini oluşturun ve organizasyon şemasında yöneticilerini tanımlayın.
3. Organizasyon şeması üzerinde değişiklikler yapın.
4. Personellere hesap oluşturun veya hesaplarını deaktive edin.

## Organizasyon Şeması Bileşeni
- Organizasyon şeması, **PrimeReact Organization Chart** bileşeni kullanılarak oluşturulur.
- Kullanıcılar, organizasyon yapısını bu bileşen üzerinden görselleştirebilir ve düzenleyebilir.
- Daha fazla bilgi için [PrimeReact Organization Chart](https://primereact.org/organizationchart/) sayfasına göz atabilirsiniz.

## Gelecekteki Geliştirmeler
- Organizasyon yapısı üzerinde daha karmaşık yetkilendirme ve raporlama özellikleri eklenebilir.
- Şuanda personellerde demo görseller kullanılmıştır. Daha sonra kişiye özel görseller eklenip kullanılabilir.

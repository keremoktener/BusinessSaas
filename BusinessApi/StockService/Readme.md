# StockService

StockService, stok yönetimi için geliştirilmiş bir mikroservis uygulamasıdır. Kullanıcıların ürün ekleme, sipariş oluşturma, tedarikçi ve müşteri yönetimi gibi işlemleri gerçekleştirmesini sağlar. Arka planda **Spring Boot**, ön yüz tarafında ise **React - TypeScript** ve **Material-UI** (MUI) kullanılarak geliştirilmiştir. Veriler genellikle **DataGrid** bileşeniyle görüntülenmektedir.

## Kullanılan Teknolojiler
- **Spring Boot**
- **Spring Security**
- **RabbitMQ**
- **Material-UI (MUI)**
- **Spring Scheduler**
- **PostgreSQL** (veritabanı)
- **JWT** (kimlik doğrulama)
- **EmailSender** (tedarikçi bilgilendirme)



## İş Mantığı (Business Logic)

### Ürünler
- Kullanıcı, ürünler ekleyip güncelleyebilir.
- Ürünlerin stok sayısı, belirlenen minimum stok seviyesinin altına düşerse ve **otomatik sipariş modu** aktifse, sistem tedarikçiye otomatik olarak sipariş e-postası gönderir.
- Sipariş işlemi, **Spring Scheduler** kullanılarak her 1 dakikada bir stokları kontrol eden bir zamanlayıcı ile gerçekleştirilir. İleride bu tarama aralığı değiştirilebilir.

### Alış Siparişleri
- Kullanıcı, almak istediği ürünler için sipariş oluşturabilir.
- Alış siparişleri depoya ürün girişi yapıldığında güncellenir ve sipariş durumu kapanır.

### Satış Siparişleri
- Kullanıcı, satış yaptığı ürünler için sipariş oluşturabilir.
- Satış yapılırken veya satışla ilgili güncelleme yapılırken depoda yeterli stok olup olmadığı kontrol edilir. Yeterli stok yoksa, kullanıcı bilgilendirilir.

### Tedarikçiler
- Sisteme tedarikçiler eklenebilir.
- Tedarikçilere, mail yoluyla hesap bilgileri gönderilir. Bu hesabı kullanarak sisteme giriş yapabilirler.
- Tedarikçiler, kendilerine gelen siparişleri kabul edebilir ve bu sürecin takibini yapabilir.

### Depolar
- Kullanıcı, depoları sisteme ekleyebilir ve güncelleyebilir.

### Ürün Kategorileri
- Ürünler belirli kategorilere atanabilir. Bu kategoriler sistemde yönetilebilir.

### Stok Hareketleri
- Depoya giriş ve çıkış yapan mallar kayıt altına alınır.
- Alış siparişi ile ilişkili bir stok girişi olduğunda, sipariş kapatılır ve depodaki ürün stok bilgisi güncellenir.

### Müşteriler
- Kullanıcı, satış yaptığı müşterilerin bilgilerini sisteme ekleyebilir ve takip edebilir.

## Otomatik Sipariş Sistemi
- Sistemde her 1 dakikada bir stoklar kontrol edilir ve eksik olan ürünler için otomatik siparişler gönderilir.
- Bu işlem **Spring Scheduler** ile yönetilir ve tedarikçilere **EmailSender** kullanılarak sipariş e-postası gönderilir.

## Kullanım
1. Sisteme ürün ekleyin ve stok seviyelerini belirleyin.
2. Tedarikçileri ve depoları tanımlayın.
3. Alış ve satış siparişlerinizi yönetin.
4. Depo hareketlerini ve stok bilgilerini güncel tutarak iş süreçlerini takip edin.
5. Tedarikçiler, kendilerine gönderilen siparişleri kabul edebilir ve süreç boyunca bilgilendirilir.

## Gelecekteki Geliştirmeler
- Otomatik sipariş tarama süresi değiştirilebilir.
- Sistemdeki iş mantığı daha da geliştirilebilir.

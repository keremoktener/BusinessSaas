package com.businessapi.utility;

import com.businessapi.dto.request.*;
import com.businessapi.entity.Payroll;
import com.businessapi.service.*;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@RequiredArgsConstructor
@Service
public class DemoDataGenerator {
    private final EmployeeService employeeService;
    private final AttendanceService attendanceService;
    private final BenefitService benefitService;
    private final PayrollService payrollService;
    private final PerformanceService performanceService;
    private final PassCardService passCardService;

    @PostConstruct
    public void generateDemoData() {
    employeeDemoData();
    attendanceDemoData();
    benefitDemoData();
    payrollDemoData();
    performanceDemoData();
    passCardDemoData();

    }
    private void employeeDemoData() {
        employeeService.saveForDemoData(new EmployeeSaveRequestDTO("Ahmet", "Yılmaz", "Mühendis", "Yazılım", "ahmet.yilmaz@example.com", "1234567890",LocalDate.of(1988, 10, 20),"ERKEK" ,LocalDate.of(2020, 1, 15), 60000.0));
        employeeService.saveForDemoData(new EmployeeSaveRequestDTO("Ayşe", "Demir", "Analist", "Finans", "ayse.demir@example.com", "0987654321",LocalDate.of(1993, 10, 21),"KADIN", LocalDate.of(2019, 5, 20), 55000.0));
        employeeService.saveForDemoData(new EmployeeSaveRequestDTO("Mehmet", "Kara", "Proje Yöneticisi", "Yönetim", "mehmet.kara@example.com", "5432167890",LocalDate.of(1995, 10, 22),"ERKEK" , LocalDate.of(2021, 3, 12), 70000.0));
        employeeService.saveForDemoData(new EmployeeSaveRequestDTO("Fatma", "Çelik", "Pazarlama Uzmanı", "Pazarlama", "fatma.celik@example.com", "6789054321",LocalDate.of(1985, 10, 25),"KADIN", LocalDate.of(2022, 6, 25), 50000.0));
        employeeService.saveForDemoData(new EmployeeSaveRequestDTO("Ali", "Öztürk", "Sistem Mühendisi", "IT", "ali.ozturk@example.com", "3216549870",LocalDate.of(1989, 11, 15),"ERKEK" , LocalDate.of(2023, 8, 30), 65000.0));
        employeeService.saveForDemoData(new EmployeeSaveRequestDTO("Zeynep", "Koç", "Yazılım Geliştirici", "Yazılım", "zeynep.koc@example.com", "7890123456",LocalDate.of(1999, 11, 10),"KADIN", LocalDate.of(2021, 11, 5), 62000.0));
        employeeService.saveForDemoData(new EmployeeSaveRequestDTO("Emre", "Aydın", "Veri Bilimci", "Analiz", "emre.aydin@example.com", "4561237890",LocalDate.of(1991, 1, 15),"ERKEK" , LocalDate.of(2020, 4, 18), 72000.0));
        employeeService.saveForDemoData(new EmployeeSaveRequestDTO("Elif", "Sönmez", "İK Uzmanı", "İK", "elif.sonmez@example.com", "1357924680",LocalDate.of(1990, 6, 6),"KADIN", LocalDate.of(2019, 2, 22), 58000.0));
        employeeService.saveForDemoData(new EmployeeSaveRequestDTO("Mert", "Akman", "Yazılım Test Mühendisi", "Yazılım", "mert.akman@example.com", "2468135790",LocalDate.of(2001, 2, 9),"ERKEK" , LocalDate.of(2021, 7, 8), 60000.0));
        employeeService.saveForDemoData(new EmployeeSaveRequestDTO("Salih", "Yurt", "Finans Müdürü", "Finans", "salih.yurt@example.com", "1597534862",LocalDate.of(1999, 5, 15),"ERKEK" , LocalDate.of(2022, 9, 15), 75000.0));
    }

    private void payrollDemoData() {
        payrollService.save(new PayrollSaveRequestDTO(1L, LocalDate.of(2023, 1, 31), 8000.0, 1000.0, 7000.0));
        payrollService.save(new PayrollSaveRequestDTO(2L, LocalDate.of(2023, 2, 28), 8500.0, 500.0, 8000.0));
        payrollService.save(new PayrollSaveRequestDTO(3L, LocalDate.of(2023, 3, 31), 7500.0, 700.0, 6800.0));
        payrollService.save(new PayrollSaveRequestDTO(4L, LocalDate.of(2023, 4, 30), 9000.0, 1200.0, 7800.0));
        payrollService.save(new PayrollSaveRequestDTO(5L, LocalDate.of(2023, 5, 31), 9500.0, 800.0, 8700.0));
        payrollService.save(new PayrollSaveRequestDTO(6L, LocalDate.of(2023, 6, 30), 8800.0, 1100.0, 7700.0));
        payrollService.save(new PayrollSaveRequestDTO(7L, LocalDate.of(2023, 7, 31), 9200.0, 950.0, 8250.0));
        payrollService.save(new PayrollSaveRequestDTO(8L, LocalDate.of(2023, 8, 31), 7800.0, 650.0, 7150.0));
        payrollService.save(new PayrollSaveRequestDTO(9L, LocalDate.of(2023, 9, 30), 8600.0, 750.0, 7850.0));
        payrollService.save(new PayrollSaveRequestDTO(10L, LocalDate.of(2023, 10, 31), 9400.0, 1200.0, 8200.0));
    }

    private void performanceDemoData() {
        performanceService.save(new PerformanceSaveRequestDTO(1L, LocalDate.of(2023, 1, 15), 85, "Çok iyi performans sergiledi."));
        performanceService.save(new PerformanceSaveRequestDTO(2L, LocalDate.of(2023, 2, 10), 78, "İyi çalıştı, bazı alanlarda gelişim gerekli."));
        performanceService.save(new PerformanceSaveRequestDTO(3L, LocalDate.of(2023, 3, 20), 92, "Mükemmel performans, tüm beklentileri aştı."));
        performanceService.save(new PerformanceSaveRequestDTO(4L, LocalDate.of(2023, 4, 18), 70, "Ortalama performans, daha fazla çaba gerekli."));
        performanceService.save(new PerformanceSaveRequestDTO(5L, LocalDate.of(2023, 5, 25), 88, "Başarılı, ancak iş yükünü daha iyi yönetmeli."));
        performanceService.save(new PerformanceSaveRequestDTO(6L, LocalDate.of(2023, 6, 5), 65, "Geliştirilmesi gereken birçok alan var."));
        performanceService.save(new PerformanceSaveRequestDTO(7L, LocalDate.of(2023, 7, 12), 91, "Harika bir performans, beklentilerin üzerinde."));
        performanceService.save(new PerformanceSaveRequestDTO(8L, LocalDate.of(2023, 8, 22), 76, "Genel olarak iyi, ancak daha dikkatli olmalı."));
        performanceService.save(new PerformanceSaveRequestDTO(9L, LocalDate.of(2023, 9, 9), 83, "Düzenli ve disiplinli bir çalışma sergiledi."));
        performanceService.save(new PerformanceSaveRequestDTO(10L, LocalDate.of(2023, 10, 3), 89, "Başarılı, takım çalışmasına katkısı yüksek."));
    }

    private void benefitDemoData() {
        benefitService.save(new BenefitSaveRequestDTO(1L, "Yemek Kartı", 500.0, LocalDate.of(2023, 1, 1), LocalDate.of(2023, 12, 31)));
        benefitService.save(new BenefitSaveRequestDTO(2L, "Yol Yardımı", 300.0, LocalDate.of(2023, 2, 1), LocalDate.of(2023, 12, 31)));
        benefitService.save(new BenefitSaveRequestDTO(3L, "Sağlık Sigortası", 1500.0, LocalDate.of(2023, 3, 1), LocalDate.of(2023, 12, 31)));
        benefitService.save(new BenefitSaveRequestDTO(4L, "Spor Üyeliği", 200.0, LocalDate.of(2023, 4, 1), LocalDate.of(2023, 12, 31)));
        benefitService.save(new BenefitSaveRequestDTO(5L, "Eğitim Desteği", 1000.0, LocalDate.of(2023, 5, 1), LocalDate.of(2023, 12, 31)));
        benefitService.save(new BenefitSaveRequestDTO(6L, "Telefon Yardımı", 250.0, LocalDate.of(2023, 6, 1), LocalDate.of(2023, 12, 31)));
        benefitService.save(new BenefitSaveRequestDTO(7L, "İnternet Desteği", 150.0, LocalDate.of(2023, 7, 1), LocalDate.of(2023, 12, 31)));
        benefitService.save(new BenefitSaveRequestDTO(8L, "Kira Yardımı", 1200.0, LocalDate.of(2023, 8, 1), LocalDate.of(2023, 12, 31)));
        benefitService.save(new BenefitSaveRequestDTO(9L, "Yemek Kartı", 600.0, LocalDate.of(2023, 9, 1), LocalDate.of(2023, 12, 31)));
        benefitService.save(new BenefitSaveRequestDTO(10L, "Yol Yardımı", 350.0, LocalDate.of(2023, 10, 1), LocalDate.of(2023, 12, 31)));
    }

    private void attendanceDemoData() {
        attendanceService.save(new AttendanceSaveRequestDTO(1L, LocalDate.of(2024, 10, 1), LocalTime.of(9, 0), LocalTime.of(17, 0)));
        attendanceService.save(new AttendanceSaveRequestDTO(2L, LocalDate.of(2024, 10, 2), LocalTime.of(8, 30), LocalTime.of(16, 30)));
        attendanceService.save(new AttendanceSaveRequestDTO(3L, LocalDate.of(2024, 10, 3), LocalTime.of(9, 15), LocalTime.of(17, 15)));
        attendanceService.save(new AttendanceSaveRequestDTO(4L, LocalDate.of(2024, 10, 4), LocalTime.of(8, 45), LocalTime.of(16, 45)));
        attendanceService.save(new AttendanceSaveRequestDTO(5L, LocalDate.of(2024, 10, 5), LocalTime.of(9, 0), LocalTime.of(17, 0)));
        attendanceService.save(new AttendanceSaveRequestDTO(6L, LocalDate.of(2024, 10, 6), LocalTime.of(8, 30), LocalTime.of(16, 30)));
        attendanceService.save(new AttendanceSaveRequestDTO(7L, LocalDate.of(2024, 10, 7), LocalTime.of(9, 0), LocalTime.of(17, 0)));
        attendanceService.save(new AttendanceSaveRequestDTO(8L, LocalDate.of(2024, 10, 8), LocalTime.of(8, 45), LocalTime.of(16, 45)));
        attendanceService.save(new AttendanceSaveRequestDTO(9L, LocalDate.of(2024, 10, 9), LocalTime.of(9, 30), LocalTime.of(17, 30)));
        attendanceService.save(new AttendanceSaveRequestDTO(10L, LocalDate.of(2024, 10, 10), LocalTime.of(8, 30), LocalTime.of(16, 30)));
    }

    private  void passCardDemoData(){
        passCardService.save(new PassCardSaveRequestDTO(1L,"a1a" ));
        passCardService.save(new PassCardSaveRequestDTO(2L,"b1b" ));
        passCardService.save(new PassCardSaveRequestDTO(3L, "c1c" ));
        passCardService.save(new PassCardSaveRequestDTO(4L, "d1d" ));
        passCardService.save(new PassCardSaveRequestDTO(5L, "e1e"));
        passCardService.save(new PassCardSaveRequestDTO(6L, "f1f" ));
        passCardService.save(new PassCardSaveRequestDTO(7L, "g1g" ));
        passCardService.save(new PassCardSaveRequestDTO(8L, "h1h" ));
        passCardService.save(new PassCardSaveRequestDTO(9L, "i1i" ));
        passCardService.save(new PassCardSaveRequestDTO(10L, "j1j"));
    }






}

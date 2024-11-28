package com.businessapi.services;

import com.businessapi.dto.request.PageRequestDTO;
import com.businessapi.dto.request.WareHouseSaveRequestDTO;
import com.businessapi.dto.request.WareHouseUpdateRequestDTO;
import com.businessapi.entities.WareHouse;
import com.businessapi.entities.enums.EStatus;
import com.businessapi.exception.ErrorType;
import com.businessapi.exception.StockServiceException;
import com.businessapi.repositories.WareHouseRepository;
import com.businessapi.util.SessionManager;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WareHouseService
{
    private final WareHouseRepository wareHouseRepository;

    public Boolean save(WareHouseSaveRequestDTO dto)
    {
        wareHouseRepository.save(WareHouse
                .builder()
                .name(dto.name())
                .memberId(SessionManager.getMemberIdFromAuthenticatedMember())
                .location(dto.location())
                .build());
        return true;
    }

    public Boolean saveForDemoData(WareHouseSaveRequestDTO dto)
    {
        wareHouseRepository.save(WareHouse
                .builder()
                .name(dto.name())
                .memberId(2L)
                .location(dto.location())
                .build());
        return true;
    }

    public Boolean delete(Long id)
    {
        WareHouse wareHouse = wareHouseRepository.findByIdAndMemberId(id, SessionManager.getMemberIdFromAuthenticatedMember()).orElseThrow(() -> new StockServiceException(ErrorType.WAREHOUSE_NOT_FOUND));
        wareHouse.setStatus(EStatus.DELETED);
        wareHouseRepository.save(wareHouse);
        return true;
    }

    public Boolean update(WareHouseUpdateRequestDTO dto)
    {
        WareHouse wareHouse = wareHouseRepository.findByIdAndMemberId(dto.id(), SessionManager.getMemberIdFromAuthenticatedMember()).orElseThrow(() -> new StockServiceException(ErrorType.WAREHOUSE_NOT_FOUND));
        if (dto.location() != null)
        {
            wareHouse.setLocation(dto.location());
        }
        if (dto.name() != null)
        {
            wareHouse.setName(dto.name());
        }
        wareHouseRepository.save(wareHouse);
        return true;
    }


    public List<WareHouse> findAllByNameContainingIgnoreCaseAndMemberIdAndStatusIsNotOrderByNameAsc(PageRequestDTO dto)
    {
        return wareHouseRepository.findAllByNameContainingIgnoreCaseAndMemberIdAndStatusIsNotOrderByNameAsc(dto.searchText(),SessionManager.getMemberIdFromAuthenticatedMember(), EStatus.DELETED, PageRequest.of(dto.page(), dto.size()));
    }

    public WareHouse findByIdAndMemberId(Long id)
    {

        return wareHouseRepository.findByIdAndMemberId(id, SessionManager.getMemberIdFromAuthenticatedMember()).orElseThrow(() -> new StockServiceException(ErrorType.WAREHOUSE_NOT_FOUND));
    }

}

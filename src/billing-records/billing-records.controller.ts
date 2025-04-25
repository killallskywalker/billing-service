import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  HttpCode,
  UseGuards,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { BillingService } from './billing-records.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { ResponseBillingRecordDto } from './dto/response-billing-record.dto';
import { CreateBillingRecordDto } from './dto/create-billing-record.dto';
import { UpdateBillingRecordDto } from './dto/update-billing-record.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { QueryBillingDto } from './dto/query-billing-record.dto';
import { UseApiDocs } from '../common/decorators/api-response-decorator';
import { PaginatedResponseDto } from '../common/dto/api-response.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/interfaces/role.enum';

@ApiTags('Billing')
@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get()
  @ApiOperation({ summary: 'Get all billing records' })
  @UseApiDocs(ResponseBillingRecordDto, {
    ok: true,
    isArray: true,
    paginated: true,
  })
  @ApiQuery({ name: 'product_code', required: false, type: String })
  @ApiQuery({ name: 'location', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: String })
  @ApiBearerAuth()
  async findAll(
    @Query() query: QueryBillingDto,
  ): Promise<PaginatedResponseDto<ResponseBillingRecordDto>> {
    return this.billingService.findMany(query);
  }

  @Get(':id')
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({ summary: 'Get specific billing record' })
  @UseApiDocs(ResponseBillingRecordDto, { ok: true, notFound: true })
  @ApiParam({ name: 'id', required: true, description: 'Billing Record Id' })
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  async show(@Param('id') id: number): Promise<ResponseBillingRecordDto> {
    return this.billingService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new billing record . Require admin role' })
  @UseApiDocs(ResponseBillingRecordDto, { ok: true, created: true })
  @ApiResponse({ status: 201, type: ResponseBillingRecordDto })
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  async create(
    @Body() createBillingDto: CreateBillingRecordDto,
  ): Promise<ResponseBillingRecordDto> {
    return this.billingService.create(createBillingDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update billing record by id' })
  @ApiParam({ name: 'id', required: true, description: 'Billing Record Id' })
  @UseApiDocs(ResponseBillingRecordDto, { notFound: true })
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  async update(
    @Param('id') id: number,
    @Body() updateBillingDto: UpdateBillingRecordDto,
  ): Promise<ResponseBillingRecordDto> {
    return this.billingService.update(id, updateBillingDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete billing by product codes' })
  @ApiParam({ name: 'id', required: false, type: String })
  @ApiResponse({ status: 204, description: 'Billing deleted successfully' })
  @ApiResponse({ status: 404, description: 'Billing not found' })
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  async remove(@Param('id') id: number): Promise<void> {
    return this.billingService.remove(id);
  }
}

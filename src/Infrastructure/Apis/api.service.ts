import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosRequestConfig } from 'axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export abstract class BaseHttpRequestService {
  constructor(
    protected readonly configService: ConfigService,
    protected httpService: HttpService,
  ) {}

  private readonly USERID =
    this.configService.get<string>('USERID') || '156066762';
  private readonly POSID =
    this.configService.get<string>('POSID') || 'SUC001POS001';
  private readonly TOKEN =
    this.configService.get<string>('TOKEN_MERCADO_PAGO') ||
    'TEST-5034444343472741-050912-53995814c25f2defa35c9887817f419a-156066762';

  async request(options?: AxiosRequestConfig) {
    const headers = {
      ['Content-Type']: 'application/json',
      ['Authorization']: `Bearer ${this.TOKEN}`,
    };

    return await firstValueFrom(
      this.httpService.request({
        ...options,
        baseURL: `https://api.mercadopago.com/instore/orders/qr/seller/collectors/${this.USERID}/pos/${this.POSID}/qrs`,
        headers,
      }),
    );
  }
}

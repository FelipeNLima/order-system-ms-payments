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

  private readonly USERID = this.configService.get<string>('USERID');
  private readonly POSID = this.configService.get<string>('POSID');
  private readonly TOKEN = this.configService.get<string>('TOKEN_MERCADO_PAGO');

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

import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from '@nestjs/terminus/dist/errors/axios.error';
import { randomBytes } from 'crypto';
import { writeFile } from 'fs/promises';
import { catchError, firstValueFrom } from 'rxjs';
import { ConfigSchemaType } from 'src/common/config.schema';
import { ZuluAssortment, ZuluSalesOrder } from './zulu-types';

@Injectable()
export class ZuluApiService {
  private readonly logger = new Logger(ZuluApiService.name);
  private apiBaseUrl = 'api/pack-center';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService<ConfigSchemaType>,
  ) {}

  async authenticate() {
    const { data } = await firstValueFrom(
      this.httpService
        .post('web/session/authenticate', {
          params: {
            login: this.configService.get('ZULU_LOGIN'),
            password: this.configService.get('ZULU_PASSWORD'),
            db: this.configService.get('ZULU_DB'),
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(`authenticate: ${error.message}`);
            throw 'An error happened!';
          }),
        ),
    );

    this.logger.debug(
      '++++++++++ Authenticated on the Zulu API ++++++++++',
      `host: ${data.result['web.base.url']}`,
      `user: ${data.result.username}`,
      `database: ${data.result.db}`,
      `session: ${data.result.session_id}`,
    );
    return data;
  }

  async checkHealth() {
    const { data } = await firstValueFrom(
      this.httpService.get(`${this.apiBaseUrl}/health-check`).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(`checkHealth: ${error.message}`);
          throw 'An error happened!';
        }),
      ),
    );
    return data;
  }

  async getSalesOrders() {
    const { data } = await firstValueFrom(
      this.httpService
        .get<ZuluSalesOrder[]>(`${this.apiBaseUrl}/sales-orders`)
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(`getSalesOrders: ${error.message}`);
            throw 'An error happened!';
          }),
        ),
    );
    return data;
  }

  async getAssortments() {
    const { data } = await firstValueFrom(
      this.httpService
        .get<ZuluAssortment[]>(`${this.apiBaseUrl}/assortments`)
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(`getAssortments: ${error.message}`);
            throw 'An error happened!';
          }),
        ),
    );
    return data;
  }

  async getCustomers(keyword?: string, per_page?: number, page?: number) {
    const { data } = await firstValueFrom(
      this.httpService
        .get(`${this.apiBaseUrl}/customers`, {
          params: {
            keyword,
            per_page,
            page,
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(`getCustomers: ${error.message}`);
            throw 'An error happened!';
          }),
        ),
    );
    return data;
  }

  async getPartner(id: number) {
    const { data } = await firstValueFrom(
      this.httpService
        .get<
          { id: number; name: string }[]
        >(`${this.apiBaseUrl}/customers/${id}`)
        .pipe(
          catchError((error) => {
            this.logger.error(`getPartner: ${error.message}`);
            throw 'An error happened!';
          }),
        ),
    );
    return data;
  }

  async getImageData(id: number): Promise<any> {
    try {
      const imageUrl = `${this.apiBaseUrl}/image?model=product.product&id=${id}`;
      const response = await firstValueFrom(
        this.httpService.get(imageUrl, { responseType: 'arraybuffer' }).pipe(
          catchError((error) => {
            this.logger.error(`getImageData: ${error.message}`);
            throw 'An error occurred!';
          }),
        ),
      );

      const { headers, data } = response;

      const buffer = Buffer.from(data, 'binary');

      const contentName =
        headers['content-disposition'].match(/filename="(.+)"/)[1];
      const size = headers['Content-Length'] || buffer.byteLength;
      const contentType = headers['Content-Type'] || 'image/png';
      const encoding = headers['Content-transfer-encoding'] || 'base64';
      // TODO move update destination to use path.join()
      const destination = 'uploads/assortments/';

      const filename = randomBytes(16).toString('hex');
      const filePath = `${destination}/${filename}`;
      await writeFile(process.cwd() + '/' + filePath, buffer);

      return {
        originalname: contentName ?? `${id}.png`,
        destination: './' + destination,
        encoding: encoding,
        mimetype: contentType,
        filename: filename,
        path: filePath,
        size: size,
      };
    } catch (error) {
      console.error('Error fetching image:', error);
      throw 'An error occurred!';
    }
  }
}
